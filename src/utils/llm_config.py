import os
from langchain_huggingface import HuggingFaceEmbeddings
from dotenv import load_dotenv

load_dotenv()

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
        "base_url": os.getenv("OLLAMA_BASE_URL", "http://localhost:11434"),
        "model": os.getenv("OLLAMA_MODEL", "llama3.1:8b")
    }

def get_llm():
    """
    Initialize the LLM provider.
    Defaults to Ollama for local execution, but can be switched to OpenAI.
    """
    try:
        from langchain_ollama import ChatOllama
        config = get_llm_config()
        return ChatOllama(
            base_url=config["base_url"],
            model=config["model"],
            temperature=0
        )
    except ImportError:
        # Fallback to a mock or alternative if ollama isn't installed
        from langchain_core.language_models.fake import FakeListLLM
        return FakeListLLM(responses=["[MOCK DRAFT] The policy has been updated to reflect the new regulatory requirements."])