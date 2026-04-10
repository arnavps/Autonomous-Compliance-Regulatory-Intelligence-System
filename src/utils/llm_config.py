import os
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import ValidationError

load_dotenv()

class ConfigurationError(Exception):
    pass

class Settings(BaseSettings):
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "llama3.1:8b"
    OPENAI_API_KEY: str | None = None
    OPENAI_BASE_URL: str | None = None
    OPENAI_MODEL: str = "gpt-4o-mini"
    
    RBI_BASE_URL: str
    SEBI_CIRCULARS_URL: str
    RBI_DRAFT_URL: str
    SEBI_DRAFT_URL: str
    API_BASE_URL: str
    NEXT_PUBLIC_API_BASE_URL: str | None = None
    FALLBACK_LLM_API_KEY: str
    LLM_ROUTING_THRESHOLD: float = 0.65

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

try:
    config = Settings()
except ValidationError as e:
    raise ConfigurationError(f"Missing required configuration: {e}")

def get_embeddings():
    """
    Initialize HuggingFace embeddings using all-MiniLM-L6-v2.
    Runs locally on CPU.
    """
    model_name = "all-MiniLM-L6-v2"
    model_kwargs = {'device': 'cpu'}
    encode_kwargs = {'normalize_embeddings': True}
    
    embeddings = HuggingFaceEmbeddings(
        model_name=model_name,
        model_kwargs=model_kwargs,
        encode_kwargs=encode_kwargs
    )
    return embeddings

def get_llm_config():
    """Returns LLM configuration from environment variables."""
    return {
        "base_url": config.OLLAMA_BASE_URL,
        "model": config.OLLAMA_MODEL
    }

def get_llm():
    """
    Initialize the LLM provider using the ModelRouter.
    Uses Ollama as primary with OpenAI fallback.
    """
    try:
        from src.engine.llm_config import get_model_router
        return get_model_router()
    except ImportError:
        # Fallback to legacy implementation if ModelRouter isn't available
        try:
            from langchain_ollama import ChatOllama
            conf = get_llm_config()
            return ChatOllama(
                base_url=conf["base_url"],
                model=conf["model"],
                temperature=0
            )
        except ImportError:
            # Final fallback to mock
            from langchain_core.language_models.fake import FakeListLLM
            return FakeListLLM(responses=["[MOCK DRAFT] The policy has been updated to reflect the new regulatory requirements."])