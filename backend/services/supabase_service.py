import os
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv

# Load environment variables
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
backend_env_path = os.path.join(base_dir, ".env")

if os.path.exists(backend_env_path):
    load_dotenv(backend_env_path)
else:
    load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

_supabase_client = None

def get_supabase_client():
    """
    Initialize and return official Supabase Python client instance.
    """
    global _supabase_client
    if _supabase_client is not None:
        return _supabase_client

    if SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "your_supabase_project_url":
        try:
            from supabase import create_client, Client
            _supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
            print("Supabase Python client initialized successfully!")
            return _supabase_client
        except Exception as e:
            print(f"WARNING: Failed to initialize Supabase client: {e}")
            return None
    else:
        print("INFO: Supabase URL or Service Key not configured in .env. Using fallback knowledge base.")
        return None

def is_database_configured() -> bool:
    """Check if Supabase credentials are path-configured."""
    return bool(SUPABASE_URL and SUPABASE_KEY and SUPABASE_URL != "your_supabase_project_url")

# Comprehensive fallback knowledge base for all 11 skin disease classes
FALLBACK_KNOWLEDGE_MAP: Dict[str, Dict[str, Any]] = {
    "Tinea Ringworm Candidiasis": {
        "disease_info": {
            "description": "Fungal skin infection caused by dermatophytes or Candida, resulting in itchy ring-shaped or erythematous patches.",
            "causes": "Kapha-Pitta aggravation caused by excessive moisture, sweat accumulation, damp skin, and lowered skin immunity.",
            "symptoms": "Red circular scaling patches, intense itching, peripheral erythema, fungal lesion expansion.",
            "severity": "Moderate"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Neem & Karanja Paste",
                "description": "Potent antimicrobial and antifungal botanical formulation.",
                "usage": "Apply bi-daily over affected areas after washing with Triphala water.",
                "precautions": "Avoid open broken lesions; perform spot patch test first."
            },
            {
                "medicine_name": "Khadirarishta",
                "description": "Classical Ayurvedic liquid tonic for blood purification and skin health.",
                "usage": "15-20 ml twice daily with equal quantity of warm water after meals.",
                "precautions": "Consult physician during pregnancy or severe acidity."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Bitter Greens & Neem Tea",
                "description": "Cleanses blood heat and suppresses fungal moisture (Kapha-Pitta).",
                "recommendation_type": "recommended"
            },
            {
                "food": "Fermented Foods & Sugars",
                "description": "Increases fungal proliferation and aggravates moisture in skin tissues.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Oily / Sensitive",
        "skin_score": 72,
        "routine": ["Neem Face Wash", "Karanja & Neem Oil", "Triphala Water Mist"]
    },
    "Warts Molluscum OR other Viral Infections": {
        "disease_info": {
            "description": "Benign viral skin growths caused by human papillomavirus (HPV) or poxvirus.",
            "causes": "Vata-Kapha vitiation leading to localized Mamsa Dhatu (muscle tissue) hyper-growth.",
            "symptoms": "Small firm flesh-colored papules, umbilicated lesions, mild localized skin tightness.",
            "severity": "Mild"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Tuvaraka Oil & Kasisadi Taila",
                "description": "Topical herbal oil known to gently reduce hyper-keratotic viral papules.",
                "usage": "Apply 1 drop directly on warts twice daily.",
                "precautions": "Keep away from eyes and surrounding delicate mucous membranes."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Warm Ginger & Black Pepper Tea",
                "description": "Stimulates cellular Agni to clear viral sluggishness.",
                "recommendation_type": "recommended"
            },
            {
                "food": "Cold Dairy & Ice Creams",
                "description": "Aggravates Kapha dosha and promotes tissue congestion.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Combination",
        "skin_score": 78,
        "routine": ["Herbal Cleanser", "Tuvaraka Spot Oil", "Aloe Vera Gel"]
    },
    "Basal Cell Carcinoma (BCC)": {
        "disease_info": {
            "description": "A common form of skin cancer arising in the basal cells of the epidermis.",
            "causes": "Chronic ultraviolet (UV) light exposure causing severe Dhatu vitiation.",
            "symptoms": "Pearly or waxy bump, non-healing open sore, rolled borders, translucent micro-vessels.",
            "severity": "High"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "URGENT DERMATOLOGY & ONCOLOGY EVALUATION",
                "description": "Requires immediate medical diagnosis, biopsy, and specialist treatment.",
                "usage": "Schedule urgent clinical appointment with a certified dermatologist.",
                "precautions": "Do not rely solely on home remedies for suspected malignant lesions."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Antioxidant-rich Pomegranate & Amla",
                "description": "Supports immune resilience and cellular health.",
                "recommendation_type": "recommended"
            },
            {
                "food": "Alcohol & Tobacco",
                "description": "Increases oxidative stress and cell mutation risks.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Sensitive",
        "skin_score": 55,
        "routine": ["Gentle Hydrating Cleanser", "Pure Aloe Vera", "Dermatologist Consultation"]
    },
    "Benign Keratosis-like Lesions (BKL)": {
        "disease_info": {
            "description": "Non-cancerous skin growths such as seborrheic keratoses or solar lentigines.",
            "causes": "Vata accumulation in epidermal skin layers with age-related melanocyte changes.",
            "symptoms": "Waxy, scaly plaques with light to dark brown pigmentation, stuck-on appearance.",
            "severity": "Low"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Kumkumadi Night Serum & Licorice Paste",
                "description": "Nourishes skin texture and softens elevated keratotic roughness.",
                "usage": "Apply 3-4 drops of Kumkumadi oil before sleep.",
                "precautions": "Gentle application only; do not scrub forcefully."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Soaked Almonds & Warm Ghee",
                "description": "Pacifies Vata dry skin and nourishes lipid barrier.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Dry / Combination",
        "skin_score": 80,
        "routine": ["Gentle Herbal Cleanser", "Licorice Exfoliant", "Kumkumadi Night Serum"]
    },
    "Dermatitis": {
        "disease_info": {
            "description": "General skin inflammation featuring erythema, pruritus, and dry scaly patches.",
            "causes": "Acute Pitta-Vata flare triggered by allergen contact, harsh chemical cosmetics, or systemic heat.",
            "symptoms": "Erythematous skin rash, burning sensation, intense itching, localized redness.",
            "severity": "Moderate"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Shatadhauta Ghrita (100x Washed Ghee)",
                "description": "Profoundly soothing cooling balm that heals dermal inflammation.",
                "usage": "Apply a thin layer to inflamed skin twice daily.",
                "precautions": "Ensure hands are sterile prior to application."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Coconut Water & Cucumber",
                "description": "Cools Pitta blood heat and reduces cutaneous erythema.",
                "recommendation_type": "recommended"
            },
            {
                "food": "Spicy Chilies & Vinegar",
                "description": "Triggers immediate Pitta flare-ups and itching.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Sensitive",
        "skin_score": 70,
        "routine": ["Sandalwood Wash", "Rose Water Hydrosol", "Shatadhauta Ghrita Balm"]
    },
    "Eczema": {
        "disease_info": {
            "description": "Chronic inflammatory skin condition causing itchy, dry, cracked skin (Vicharchika).",
            "causes": "Kapha-Pitta imbalance with Rakta Dhatu impurity and compromised skin lipid barrier.",
            "symptoms": "Dry, intensely itchy, inflamed patches, lichenified skin, loss of natural moisture.",
            "severity": "Moderate to High"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Manjisthadi Kwath & Bakuchi Oil",
                "description": "Blood-purifying formulation combined with barrier-repairing botanical oil.",
                "usage": "Take 15 ml Kwath with warm water; apply oil externally on dry patches.",
                "precautions": "Test Bakuchi oil on small patch to check sun sensitivity."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Mung Bean Soup & Steamed Vegetables",
                "description": "Light, easily digestible foods that restore tissue equilibrium.",
                "recommendation_type": "recommended"
            },
            {
                "food": "Incompatible Food Combos (Fish + Milk)",
                "description": "Produces Viruddha Ahara toxins (Ama) that aggravate Eczema.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Dry / Sensitive",
        "skin_score": 68,
        "routine": ["Manjistha Cleanser", "Bakuchi Healing Oil", "Virgin Coconut Lotion"]
    },
    "Atopic Dermatitis": {
        "disease_info": {
            "description": "An allergic skin flare common in prone individuals, causing intense itching and skin scaling.",
            "causes": "Tridosha vitiation with dominant Vata dryness and Pitta inflammatory response.",
            "symptoms": "Pruritic red rash, skin flaking, dry patches on flexural folds, skin sensitivity.",
            "severity": "Moderate"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Nimbadi Churna & Virgin Coconut Oil",
                "description": "Calms skin reactivity and restores moisture lipid barrier.",
                "usage": "Apply coconut oil liberally after bathing; take Nimbadi as advised by Vaidya.",
                "precautions": "Avoid synthetic fragrances and harsh laundry detergents."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Fresh Cilantro Juice & Sweet Fruits",
                "description": "Cools internal systemic heat and calms skin reactivity.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Dry / Sensitive",
        "skin_score": 69,
        "routine": ["Neem Gentle Cleanser", "Rose Water Mist", "Virgin Coconut Lotion"]
    },
    "Melanocytic Nevi (NV)": {
        "disease_info": {
            "description": "Common benign skin mole composed of melanocytes.",
            "causes": "Benign localized accumulation of Bhrajaka Pitta and melanin pigment.",
            "symptoms": "Uniformly pigmented tan/brown macule or papule, distinct smooth symmetrical borders.",
            "severity": "Low (Normal)"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Aloe Vera Gel & Damask Rose Water",
                "description": "Soothing daily antioxidant hydrator for maintaining healthy pigment balance.",
                "usage": "Apply daily after cleansing.",
                "precautions": "Monitor moles periodically for any ABCDE changes (Asymmetry, Border, Color, Diameter, Evolving)."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Fresh Berries & Green Tea",
                "description": "Rich in natural polyphenols and antioxidants.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Normal / Combination",
        "skin_score": 88,
        "routine": ["Gentle Face Wash", "Rose Water Mist", "Aloe Vera Moisturizer"]
    },
    "Melanoma": {
        "disease_info": {
            "description": "Serious form of skin cancer that begins in melanocytes.",
            "causes": "High-risk malignant melanocytic transformation due to severe DNA/UV damage.",
            "symptoms": "Asymmetrical dark lesion, irregular notched borders, color variation, evolving size.",
            "severity": "Critical / High"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "IMMEDIATE SPECIALIST ONCOLOGY CARE",
                "description": "Requires urgent medical oncological biopsy, staging, and surgical/clinical management.",
                "usage": "Seek emergency medical care at an accredited cancer hospital.",
                "precautions": "Do not apply unknown pastes or delay professional oncology evaluation."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Organic Whole Foods & Pure Water",
                "description": "Supports body strength alongside medical therapies.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Sensitive",
        "skin_score": 50,
        "routine": ["Mild Cleanser", "Soothe Gel", "Immediate Oncology Evaluation"]
    },
    "Normal": {
        "disease_info": {
            "description": "No supported skin disease or lesion detected. Healthy skin balance.",
            "causes": "Balanced Tridosha (Harmonious Vata, Pitta, and Kapha equilibrium).",
            "symptoms": "Even skin tone, balanced sebum secretion, smooth texture, healthy complexion.",
            "severity": "None (Healthy)"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Daily Gentle Herbal Care (Neem & Rose)",
                "description": "Maintains natural skin Agni, radiance, and moisture equilibrium.",
                "usage": "Cleanse daily, apply rose water hydrosol, and use light natural moisturizer.",
                "precautions": "Use broad-spectrum sunscreen when outdoors."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Balanced Seasonal Ayurvedic Meals",
                "description": "Fresh organic fruits, vegetables, ghee, seeds, and adequate hydrated water.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Normal",
        "skin_score": 92,
        "routine": ["Gentle Neem Cleanser", "Rose Hydrosol", "Kumkumadi Glow Elixir"]
    },
    "Psoriasis": {
        "disease_info": {
            "description": "Autoimmune skin condition causing rapid skin cell buildup leading to scaly patches (Ekakushta).",
            "causes": "Vata-Kapha dryness coupled with Pitta inflammation and immune hyper-reactivity.",
            "symptoms": "Silvery-white scaly plaques, erythematous base, thickened skin patches, severe dryness.",
            "severity": "High"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Wrightia Tinctoria (7-Day Oil)",
                "description": "Renowned traditional herbal oil for scaling psoriasis plaques.",
                "usage": "Apply gently over affected plaques 30 minutes before bathing.",
                "precautions": "Do not forcibly scratch or peel scales off skin."
            },
            {
                "medicine_name": "Manjistha & Neem Decoction",
                "description": "Internal blood detoxifying herbal wash.",
                "usage": "15 ml twice daily as recommended by physician.",
                "precautions": "Avoid during acute digestive upset."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Ghee, Boiled Mung Beans, Zucchini",
                "description": "Soothes Vata dryness and calms Pitta immune inflammation.",
                "recommendation_type": "recommended"
            },
            {
                "food": "Nightshades & Processed Salt",
                "description": "Triggers psoriasis plaque flare-ups.",
                "recommendation_type": "avoid"
            }
        ],
        "skin_type": "Dry / Sensitive",
        "skin_score": 65,
        "routine": ["Neem Herbal Wash", "Wrightia Tinctoria Oil", "Shatadhauta Ghrita"]
    },
    "Seborrheic Keratoses": {
        "disease_info": {
            "description": "Common non-cancerous skin growth that appears as a waxy brown or black plaque.",
            "causes": "Age-related Vata-Kapha accumulation in outer epidermal layers.",
            "symptoms": "Benign raised warty plaque, brown/black pigmented surface, distinct rounded borders.",
            "severity": "Low"
        },
        "ayurvedic_recommendations": [
            {
                "medicine_name": "Triphala Powder & Licorice Cream",
                "description": "Gentle botanical exfoliant and skin smoother.",
                "usage": "Apply light licorice cream daily to keep lesion lubricated.",
                "precautions": "Gentle topical care; avoid picking."
            }
        ],
        "diet_recommendations": [
            {
                "food": "Warm Golden Milk & Hydrating Soups",
                "description": "Pacifies Vata dry skin and nourishes aging tissues.",
                "recommendation_type": "recommended"
            }
        ],
        "skin_type": "Normal / Dry",
        "skin_score": 82,
        "routine": ["Triphala Wash", "Licorice Cream", "Rose Hydration Gel"]
    }
}

DEFAULT_FALLBACK = FALLBACK_KNOWLEDGE_MAP["Normal"]

async def fetch_disease_data(predicted_disease: str) -> Dict[str, Any]:
    """
    Query Supabase database tables (diseases, medicines, diets) for the predicted disease.
    If Supabase is unconfigured or query yields no result, fallback to local knowledge base.
    """
    client = get_supabase_client()

    if client is not None:
        try:
            # Query 'diseases' table
            res = client.from_("diseases").select("*").ilike("disease_name", f"%{predicted_disease}%").execute()
            diseases_data = res.data if res else []

            if not diseases_data:
                # Try exact match if ilike fails
                res = client.from_("diseases").select("*").eq("disease_name", predicted_disease).execute()
                diseases_data = res.data if res else []

            if diseases_data and len(diseases_data) > 0:
                disease_row = diseases_data[0]
                disease_id = disease_row.get("id")

                # Fetch related medicines
                med_res = client.from_("medicines").select("*").eq("disease_id", disease_id).execute()
                medicines_data = med_res.data if med_res else []

                # Fetch related diets
                diet_res = client.from_("diets").select("*").eq("disease_id", disease_id).execute()
                diets_data = diet_res.data if diet_res else []

                disease_info = {
                    "description": disease_row.get("description", ""),
                    "causes": disease_row.get("causes", ""),
                    "symptoms": disease_row.get("symptoms", ""),
                    "severity": disease_row.get("severity", "Moderate")
                }

                ayurvedic_recommendations = [
                    {
                        "medicine_name": m.get("medicine_name", "Herbal Medicine"),
                        "description": m.get("description", ""),
                        "usage": m.get("usage", ""),
                        "precautions": m.get("precautions", "")
                    }
                    for m in medicines_data
                ]

                diet_recommendations = [
                    {
                        "food": d.get("food", "Healthy Diet"),
                        "description": d.get("description", ""),
                        "recommendation_type": d.get("recommendation_type", "recommended")
                    }
                    for d in diets_data
                ]

                # Find match in local map for extra convenience fields if needed
                fallback = FALLBACK_KNOWLEDGE_MAP.get(predicted_disease, DEFAULT_FALLBACK)

                return {
                    "disease_info": disease_info,
                    "ayurvedic_recommendations": ayurvedic_recommendations,
                    "diet_recommendations": diet_recommendations,
                    "skin_type": fallback.get("skin_type", "Combination"),
                    "skin_score": fallback.get("skin_score", 80),
                    "routine": fallback.get("routine", ["Neem Wash", "Aloe Vera Gel"])
                }
        except Exception as e:
            print(f"WARNING: Exception querying Supabase database: {e}. Switching to local knowledge base fallback.")

    # Fallback lookup
    # Normalize disease key lookup
    matched_key = None
    for key in FALLBACK_KNOWLEDGE_MAP.keys():
        if key.lower() in predicted_disease.lower() or predicted_disease.lower() in key.lower():
            matched_key = key
            break

    fallback_data = FALLBACK_KNOWLEDGE_MAP.get(matched_key or predicted_disease, DEFAULT_FALLBACK)

    return {
        "disease_info": fallback_data["disease_info"],
        "ayurvedic_recommendations": fallback_data["ayurvedic_recommendations"],
        "diet_recommendations": fallback_data["diet_recommendations"],
        "skin_type": fallback_data.get("skin_type", "Combination"),
        "skin_score": fallback_data.get("skin_score", 80),
        "routine": fallback_data.get("routine", ["Neem Wash", "Aloe Vera Gel"])
    }

# ============================================================
# SCAN HISTORY & SUPABASE STORAGE INTEGRATION FOR PROGRESS PAGE
# ============================================================
import uuid
import datetime
import base64

SKIN_SCANS_BUCKET = "skin-scans"

# In-memory fallback scan store
_in_memory_scans: List[Dict[str, Any]] = []

def ensure_storage_bucket():
    """Ensure the skin-scans bucket exists in Supabase Storage."""
    client = get_supabase_client()
    if client is None:
        return
    try:
        buckets = client.storage.list_buckets()
        bucket_names = [b.name for b in buckets] if buckets else []
        if SKIN_SCANS_BUCKET not in bucket_names:
            client.storage.create_bucket(SKIN_SCANS_BUCKET, options={"public": True})
            print(f"Created Supabase Storage bucket: {SKIN_SCANS_BUCKET}")
    except Exception as e:
        print(f"Note on checking/creating storage bucket '{SKIN_SCANS_BUCKET}': {e}")

async def save_scan_record_to_supabase(
    user_id: str,
    image_bytes: bytes,
    file_name: str,
    predicted_disease: str,
    confidence: float,
    skin_health_score: int
) -> Dict[str, Any]:
    """
    1. Generates unique scan_id (e.g. scan-1728000000000-abcd).
    2. Uploads image to Supabase Storage: skin-scans/{user_id}/{scan_id}.jpg
    3. Retrieves public or signed URL.
    4. Inserts new row into 'skin_scans' table:
       - id: scan_id
       - user_id: user_id
       - image_path: {user_id}/{scan_id}.jpg
       - image_url: image_url
       - predicted_disease: predicted_disease
       - confidence: confidence
       - skin_health_score: skin_health_score
       - created_at: current ISO timestamp
    5. Fallbacks gracefully to memory/local store if DB connection fails.
    """
    client = get_supabase_client()
    timestamp_ms = int(datetime.datetime.now(datetime.timezone.utc).timestamp() * 1000)
    unique_suffix = uuid.uuid4().hex[:6]
    scan_id = f"scan-{timestamp_ms}-{unique_suffix}"
    
    clean_user_id = user_id or "user_demo"
    image_path = f"{clean_user_id}/{scan_id}.jpg"
    created_at_iso = datetime.datetime.now(datetime.timezone.utc).isoformat()
    
    image_url = ""
    
    # 1. Try uploading to Supabase Storage bucket 'skin-scans'
    if client is not None:
        try:
            ensure_storage_bucket()
            client.storage.from_(SKIN_SCANS_BUCKET).upload(
                path=image_path,
                file=image_bytes,
                file_options={"content-type": "image/jpeg", "cache-control": "3600", "upsert": "false"}
            )
            public_url_res = client.storage.from_(SKIN_SCANS_BUCKET).get_public_url(image_path)
            if public_url_res:
                image_url = public_url_res
        except Exception as e:
            print(f"Storage upload note for '{SKIN_SCANS_BUCKET}': {e}")
            image_url = ""

    if not image_url:
        b64_str = base64.b64encode(image_bytes).decode('utf-8')
        image_url = f"data:image/jpeg;base64,{b64_str}"

    scan_record = {
        "id": scan_id,
        "user_id": clean_user_id,
        "image_path": image_path,
        "image_url": image_url,
        "predicted_disease": predicted_disease,
        "confidence": confidence,
        "skin_health_score": skin_health_score,
        "created_at": created_at_iso
    }

    # 2. Try inserting new row into 'skin_scans' database table
    if client is not None:
        try:
            insert_res = client.from_("skin_scans").insert([scan_record]).execute()
            if insert_res and insert_res.data:
                print(f"Successfully saved scan record {scan_id} to skin_scans table!")
        except Exception as e:
            print(f"Note: Could not insert into skin_scans DB table: {e}. Preserving in local fallback store.")

    # Always add to in-memory fallback store
    _in_memory_scans.append(scan_record)

    return scan_record

async def get_user_progress_data(user_id: str) -> Dict[str, Any]:
    """
    Retrieves scan history for a given user from Supabase skin_scans table:
    - Earliest scan (ORDER BY created_at ASC LIMIT 1) -> initial_scan
    - Latest scan (ORDER BY created_at DESC LIMIT 1) -> latest_scan
    - Full history (ORDER BY created_at DESC) -> scan_history
    """
    client = get_supabase_client()
    clean_user_id = user_id or "user_demo"
    
    db_scans: List[Dict[str, Any]] = []

    if client is not None:
        try:
            res = client.from_("skin_scans").select("*").eq("user_id", clean_user_id).order("created_at", desc=True).execute()
            if res and res.data and len(res.data) > 0:
                db_scans = res.data
        except Exception as e:
            print(f"Note: Exception querying skin_scans table: {e}")

    # Combine with in-memory scans
    user_mem_scans = [s for s in _in_memory_scans if s.get("user_id") == clean_user_id]
    
    existing_ids = {s["id"] for s in db_scans}
    for ms in user_mem_scans:
        if ms["id"] not in existing_ids:
            db_scans.append(ms)

    # Sort all scans by created_at DESC
    def parse_time(item):
        cat = item.get("created_at")
        if not cat:
            return 0
        try:
            return datetime.datetime.fromisoformat(cat.replace("Z", "+00:00")).timestamp()
        except:
            return 0

    db_scans.sort(key=parse_time, reverse=True)

    def format_scan_detail(scan: Dict[str, Any]) -> Dict[str, Any]:
        cat = scan.get("created_at", "")
        formatted_date = "No date"
        if cat:
            try:
                dt = datetime.datetime.fromisoformat(cat.replace("Z", "+00:00"))
                formatted_date = dt.strftime("%d %b %Y")
            except:
                formatted_date = str(cat)[:10]

        conf_val = scan.get("confidence", 0.90)
        if isinstance(conf_val, str):
            try:
                conf_val = float(conf_val.replace("%", "")) / 100.0 if "%" in conf_val else float(conf_val)
            except:
                conf_val = 0.90

        return {
            "id": scan.get("id", ""),
            "image_url": scan.get("image_url", ""),
            "date": formatted_date,
            "disease": scan.get("predicted_disease", "Skin Analysis"),
            "confidence": round(float(conf_val), 2),
            "skin_health_score": int(scan.get("skin_health_score", 80))
        }

    scan_count = len(db_scans)
    
    if scan_count == 0:
        return {
            "success": True,
            "initial_scan": None,
            "latest_scan": None,
            "overall_improvement": {
                "points": 0,
                "status": "no_data"
            },
            "skin_health": {
                "score": 0,
                "factors": [
                    {"name": "Hydration", "score": 0, "status": "No data"},
                    {"name": "Acne Care", "score": 0, "status": "No data"},
                    {"name": "Texture", "score": 0, "status": "No data"},
                    {"name": "Pigmentation", "score": 0, "status": "No data"},
                    {"name": "Radiance", "score": 0, "status": "No data"}
                ]
            },
            "scan_history": []
        }

    # Latest scan is index 0 (newest DESC)
    latest_item = db_scans[0]
    # Initial scan is index -1 (earliest ASC)
    initial_item = db_scans[-1]

    initial_scan_detail = format_scan_detail(initial_item)
    latest_scan_detail = format_scan_detail(latest_item)

    initial_score = initial_scan_detail["skin_health_score"]
    latest_score = latest_scan_detail["skin_health_score"]
    diff_points = latest_score - initial_score

    if scan_count == 1:
        status_str = "initial"
    elif diff_points > 0:
        status_str = "improved"
    elif diff_points < 0:
        status_str = "declined"
    else:
        status_str = "maintained"

    history_items = []
    for s in db_scans:
        formatted = format_scan_detail(s)
        history_items.append({
            "id": formatted["id"],
            "image_url": formatted["image_url"],
            "date": formatted["date"],
            "disease": formatted["disease"],
            "score": formatted["skin_health_score"]
        })

    current_health_score = latest_score
    factors = [
        {"name": "Hydration", "score": min(100, current_health_score + 3), "status": "Excellent" if current_health_score >= 80 else "Good"},
        {"name": "Acne Care", "score": max(50, current_health_score - 8), "status": "Good" if current_health_score >= 70 else "Fair"},
        {"name": "Texture", "score": min(100, current_health_score - 2), "status": "Good" if current_health_score >= 75 else "Fair"},
        {"name": "Pigmentation", "score": max(45, current_health_score - 15), "status": "Fair" if current_health_score < 75 else "Good"},
        {"name": "Radiance", "score": min(100, current_health_score + 8), "status": "Excellent" if current_health_score >= 80 else "Good"}
    ]

    return {
        "success": True,
        "initial_scan": initial_scan_detail,
        "latest_scan": latest_scan_detail,
        "overall_improvement": {
            "points": diff_points,
            "status": status_str
        },
        "skin_health": {
            "score": current_health_score,
            "factors": factors
        },
        "scan_history": history_items
    }

