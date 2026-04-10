import os
import time
import logging
from typing import Dict, Any, Optional
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)

class ModelRouter:
    """
    Router for LLM models with primary Ollama and OpenAI fallback.
    Implements timeout and confidence-based fallback logic.
    """
    
    def __init__(self):
        self.primary_timeout = 10  # seconds
        self.confidence_threshold = 70  # percentage
        self.primary_model = None
        self.fallback_model = None
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize primary (Ollama) and fallback (OpenAI) models."""
        try:
            from langchain_ollama import ChatOllama
            # Primary: Ollama (Llama 3.1:8b)
            self.primary_model = ChatOllama(
                base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
                model=os.getenv("OLLAMA_MODEL", "llama3.1:8b"),
                temperature=0
            )
            logger.info("Primary Ollama model initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize primary model: {e}")
            self.primary_model = None
        
        try:
            from langchain_openai import ChatOpenAI
            # Fallback: OpenAI (GPT-4o-mini)
            openai_api_key = os.getenv("OPENAI_API_KEY")
            if openai_api_key and openai_api_key != "your_openai_api_key_here":
                openai_base_url = os.getenv("OPENAI_BASE_URL")
                openai_model = os.getenv("OPENAI_MODEL", "gpt-4o-mini")
                
                client_kwargs = {}
                if openai_base_url:
                    client_kwargs["base_url"] = openai_base_url
                
                self.fallback_model = ChatOpenAI(
                    model=openai_model,
                    api_key=openai_api_key,
                    temperature=0,
                    **client_kwargs
                )
                logger.info("Fallback OpenAI model initialized successfully")
            else:
                logger.warning("OpenAI API key not configured")
                self.fallback_model = None
        except Exception as e:
            logger.error(f"Failed to initialize fallback model: {e}")
            self.fallback_model = None
    
    def _run_with_timeout(self, model: Any, prompt: str, timeout: int) -> Optional[str]:
        """Run model inference with timeout."""
        start_time = time.time()
        try:
            result = model.invoke(prompt)
            elapsed = time.time() - start_time
            
            if elapsed > timeout:
                logger.warning(f"Model inference took {elapsed:.2f}s, exceeding timeout of {timeout}s")
                return None
            
            return result.content
        except Exception as e:
            logger.error(f"Model inference failed: {e}")
            return None
    
    def _get_confidence_score(self, response: str) -> int:
        """
        Simple confidence scoring based on response quality.
        This is a placeholder - in production, use the actual ConfidenceScorer.
        """
        if not response:
            return 0
        
        # Basic heuristics for confidence scoring
        confidence = 50  # Base score
        
        # Length-based confidence
        if len(response) > 100:
            confidence += 20
        elif len(response) > 50:
            confidence += 10
        
        # Content-based confidence
        if any(keyword in response.lower() for keyword in ['based on', 'according to', 'the regulation states']):
            confidence += 15
        
        # Structure-based confidence
        if '.' in response and response.count('.') > 2:
            confidence += 15
        
        return min(confidence, 100)
    
    def invoke(self, prompt: str, confidence_score: Optional[int] = None) -> Dict[str, Any]:
        """
        Invoke the model router with fallback logic.
        
        Args:
            prompt: The input prompt
            confidence_score: Optional pre-computed confidence score
            
        Returns:
            Dict containing response, model_used, confidence_score, and timing info
        """
        result = {
            "response": None,
            "model_used": None,
            "confidence_score": confidence_score or 0,
            "fallback_triggered": False,
            "error": None
        }
        
        # Try primary model first
        if self.primary_model:
            logger.info("Attempting primary model (Ollama)")
            start_time = time.time()
            
            response = self._run_with_timeout(self.primary_model, prompt, self.primary_timeout)
            
            if response is not None:
                elapsed = time.time() - start_time
                
                # Calculate confidence if not provided
                if confidence_score is None:
                    confidence_score = self._get_confidence_score(response)
                
                result.update({
                    "response": response,
                    "model_used": "ollama",
                    "confidence_score": confidence_score,
                    "timing": elapsed
                })
                
                # Check if fallback is needed due to low confidence
                if confidence_score < self.confidence_threshold and self.fallback_model:
                    logger.info(f"Low confidence ({confidence_score}%), triggering fallback")
                    result["fallback_triggered"] = True
                    return self._invoke_fallback(prompt, result)
                
                logger.info(f"Primary model successful (confidence: {confidence_score}%)")
                return result
            else:
                logger.warning("Primary model failed or timed out")
        
        # Fallback to OpenAI if primary failed
        if self.fallback_model:
            logger.info("Falling back to OpenAI model")
            return self._invoke_fallback(prompt, result)
        
        # No models available
        result["error"] = "No models available"
        logger.error("No models available for inference")
        return result
    
    def _invoke_fallback(self, prompt: str, result: Dict[str, Any]) -> Dict[str, Any]:
        """Invoke the fallback model (OpenAI)."""
        start_time = time.time()
        
        try:
            response = self._run_with_timeout(self.fallback_model, prompt, 30)  # Longer timeout for fallback
            
            if response is not None:
                elapsed = time.time() - start_time
                confidence_score = self._get_confidence_score(response)
                
                result.update({
                    "response": response,
                    "model_used": "High-Accuracy Fallback",
                    "confidence_score": confidence_score,
                    "timing": elapsed,
                    "fallback_triggered": True
                })
                
                logger.info(f"Fallback model successful (confidence: {confidence_score}%)")
            else:
                result["error"] = "Fallback model failed"
                logger.error("Fallback model failed")
                
        except Exception as e:
            result["error"] = str(e)
            logger.error(f"Fallback model error: {e}")
        
        return result

# Singleton instance (lazy-initialized)
_model_router: Optional[ModelRouter] = None

def get_model_router() -> ModelRouter:
    """Get the singleton ModelRouter instance (lazy init)."""
    global _model_router
    if _model_router is None:
        _model_router = ModelRouter()
    return _model_router

EARLY_WARNING_PROMPT = """
You are an expert regulatory analyst for financial intelligence (RegIntel).
Analyze the following draft paper or consultation paper snippet:
{text}

Extract the following information about this early warning draft and output it as a valid JSON object strictly matching this structure:
{{
    "proposed_change": "Brief description of proposed regulatory changes",
    "affected_entities": "List of affected financial entities (e.g., NBFCs, Banks, Fintechs)",
    "urgency": "High, Medium, or Low",
    "probability": "Estimated probability of this change taking effect (e.g. 75%)"
}}
Return ONLY valid JSON.
"""

def extract_early_warning_metadata(text: str) -> dict:
    """Extract metadata for an early warning draft using the LLM."""
    import json
    router = get_model_router()
    prompt = EARLY_WARNING_PROMPT.format(text=text)
    result = router.invoke(prompt)
    if result.get("response"):
        try:
            response_text = result["response"]
            # Clean possible markdown formatting
            if "```json" in response_text:
                response_text = response_text.split("```json")[1].split("```")[0]
            elif "```" in response_text:
                response_text = response_text.split("```")[1].split("```")[0]
            
            data = json.loads(response_text.strip())
            return {
                "proposed_change": data.get("proposed_change", "Unknown change"),
                "affected_entities": data.get("affected_entities", "Unknown entities"),
                "urgency": data.get("urgency", "Medium"),
                "probability": data.get("probability", "50%")
            }
        except Exception as e:
            logger.error(f"Error parsing early warning metadata JSON: {e}")
            pass
            
    return {
        "proposed_change": "Failed to parse metadata",
        "affected_entities": "Unknown",
        "urgency": "Medium",
        "probability": "50%"
    }
