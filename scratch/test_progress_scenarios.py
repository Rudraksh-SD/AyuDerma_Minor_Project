import asyncio
import sys
import os

# Ensure backend directory is in python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from backend.services.supabase_service import save_scan_record_to_supabase, get_user_progress_data

async def test_scenarios():
    user_id = "test_user_scenario_17"
    print("==================================================")
    print("TESTING USER PROGRESS SCAN SCENARIOS")
    print("==================================================")

    # CASE 1: No scans
    p0 = await get_user_progress_data(user_id)
    print("0 Scans Initial:", p0["initial_scan"])
    print("0 Scans Latest:", p0["latest_scan"])
    assert p0["initial_scan"] is None
    assert p0["latest_scan"] is None
    assert p0["scan_history"] == []
    print("[PASS] Case 1 (0 Scans) Verified!")

    # UPLOAD #1: skin1.jpg -> Eczema, score 70
    s1 = await save_scan_record_to_supabase(
        user_id=user_id,
        image_bytes=b"fake_image_1_bytes",
        file_name="skin1.jpg",
        predicted_disease="Eczema",
        confidence=0.85,
        skin_health_score=70
    )
    print("\nUploaded #1 (skin1.jpg)")
    p1 = await get_user_progress_data(user_id)
    print("1 Scan Initial:", p1["initial_scan"]["disease"], p1["initial_scan"]["id"])
    print("1 Scan Latest: ", p1["latest_scan"]["disease"], p1["latest_scan"]["id"])
    assert p1["initial_scan"]["id"] == s1["id"]
    assert p1["latest_scan"]["id"] == s1["id"]
    print("[PASS] Upload #1 Verified: Initial == Latest == skin1.jpg")

    # UPLOAD #2: skin2.jpg -> Dermatitis, score 75
    await asyncio.sleep(0.01)
    s2 = await save_scan_record_to_supabase(
        user_id=user_id,
        image_bytes=b"fake_image_2_bytes",
        file_name="skin2.jpg",
        predicted_disease="Dermatitis",
        confidence=0.89,
        skin_health_score=75
    )
    print("\nUploaded #2 (skin2.jpg)")
    p2 = await get_user_progress_data(user_id)
    print("2 Scans Initial:", p2["initial_scan"]["disease"], p2["initial_scan"]["id"])
    print("2 Scans Latest: ", p2["latest_scan"]["disease"], p2["latest_scan"]["id"])
    assert p2["initial_scan"]["id"] == s1["id"], "Initial Scan MUST remain Image #1!"
    assert p2["latest_scan"]["id"] == s2["id"], "Latest Scan MUST become Image #2!"
    print("[PASS] Upload #2 Verified: Initial == skin1.jpg, Latest == skin2.jpg")

    # UPLOAD #3: skin3.jpg -> Psoriasis, score 78
    await asyncio.sleep(0.01)
    s3 = await save_scan_record_to_supabase(
        user_id=user_id,
        image_bytes=b"fake_image_3_bytes",
        file_name="skin3.jpg",
        predicted_disease="Psoriasis",
        confidence=0.91,
        skin_health_score=78
    )
    print("\nUploaded #3 (skin3.jpg)")
    p3 = await get_user_progress_data(user_id)
    print("3 Scans Initial:", p3["initial_scan"]["disease"], p3["initial_scan"]["id"])
    print("3 Scans Latest: ", p3["latest_scan"]["disease"], p3["latest_scan"]["id"])
    assert p3["initial_scan"]["id"] == s1["id"], "Initial Scan MUST remain Image #1!"
    assert p3["latest_scan"]["id"] == s3["id"], "Latest Scan MUST become Image #3!"
    print("[PASS] Upload #3 Verified: Initial == skin1.jpg, Latest == skin3.jpg")

    # UPLOAD #4: skin4.jpg -> Normal, score 90
    await asyncio.sleep(0.01)
    s4 = await save_scan_record_to_supabase(
        user_id=user_id,
        image_bytes=b"fake_image_4_bytes",
        file_name="skin4.jpg",
        predicted_disease="Normal",
        confidence=0.96,
        skin_health_score=90
    )
    print("\nUploaded #4 (skin4.jpg)")
    p4 = await get_user_progress_data(user_id)
    print("4 Scans Initial:", p4["initial_scan"]["disease"], p4["initial_scan"]["id"])
    print("4 Scans Latest: ", p4["latest_scan"]["disease"], p4["latest_scan"]["id"])
    assert p4["initial_scan"]["id"] == s1["id"], "Initial Scan MUST remain Image #1!"
    assert p4["latest_scan"]["id"] == s4["id"], "Latest Scan MUST become Image #4!"
    assert len(p4["scan_history"]) == 4, "All 4 scans MUST be preserved in history!"
    print("[PASS] Upload #4 Verified: Initial == skin1.jpg, Latest == skin4.jpg")

    print("\n==================================================")
    print("ALL TEST SCENARIOS PASSED PERFECTLY!")
    print("==================================================")

if __name__ == "__main__":
    asyncio.run(test_scenarios())
