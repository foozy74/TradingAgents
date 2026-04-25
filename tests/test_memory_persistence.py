import os
import shutil
import json
import sys
from tradingagents.agents.utils.memory import FinancialSituationMemory

def test_memory_persistence():
    memory_name = "test_persistence_memory"
    # Match the project structure: tradingagents/dataflows/data_cache
    project_dir = os.path.join(os.getcwd(), "tradingagents")
    test_config = {"project_dir": project_dir}
    
    # Ensure a clean start
    cache_dir = os.path.join(project_dir, "dataflows/data_cache")
    memory_file = os.path.join(cache_dir, f"memories_{memory_name}.json")
    if os.path.exists(memory_file):
        os.remove(memory_file)
    
    print(f"--- Phase 1: Initialize and Add Data ---")
    memory = FinancialSituationMemory(memory_name, test_config)
    
    test_data = [
        ("The market is bullish with high volume.", "Buy aggressive growth stocks."),
        ("Inflation is rising rapidly.", "Shift to defensive sectors like utilities.")
    ]
    
    memory.add_situations(test_data)
    print("Added situations to memory.")
    
    # Verify file exists
    if os.path.exists(memory_file):
        print(f"SUCCESS: Memory file created at {memory_file}")
    else:
        print(f"FAILURE: Memory file NOT created at {memory_file}")
        return

    # Verify content
    with open(memory_file, 'r') as f:
        stored_data = json.load(f)
        if len(stored_data["documents"]) == 2:
            print("SUCCESS: Stored data has correct number of documents.")
        else:
            print(f"FAILURE: Stored data has {len(stored_data['documents'])} documents, expected 2.")
            return

    print(f"\n--- Phase 2: Reload and Verify ---")
    # Create a NEW instance with the same name
    new_memory = FinancialSituationMemory(memory_name, test_config)
    
    if len(new_memory.documents) == 2:
        print("SUCCESS: Reloaded memory has correct number of documents.")
    else:
        print(f"FAILURE: Reloaded memory has {len(new_memory.documents)} documents, expected 2.")
        return
        
    # Test retrieval from reloaded memory
    results = new_memory.get_memories("Is the market bullish?", n_matches=1)
    if results and "Buy aggressive growth stocks" in results[0]["recommendation"]:
        print(f"SUCCESS: Retrieval from reloaded memory works! Match: {results[0]['recommendation']}")
    else:
        print(f"FAILURE: Retrieval failed. Results: {results}")
        return

    print(f"\n--- Phase 3: Clear and Verify ---")
    new_memory.clear()
    if not os.path.exists(memory_file) or os.path.getsize(memory_file) < 50: # Check if empty-ish JSON
        # Actually our clear calls _save_memory which writes empty lists
        with open(memory_file, 'r') as f:
            cleared_data = json.load(f)
            if len(cleared_data["documents"]) == 0:
                print("SUCCESS: Memory file cleared on disk.")
            else:
                print("FAILURE: Memory file still contains data.")
    
    # Cleanup
    if os.path.exists(memory_file):
        os.remove(memory_file)
    print("\nTest completed successfully!")

if __name__ == "__main__":
    test_memory_persistence()
