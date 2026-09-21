"""
Database seed script for HDFC Life Insurance backend.

Usage (from the backend directory):
    python seed.py

This script:
  1. Connects to MongoDB
  2. Drops and recreates collections
  3. Inserts 6 insurance products (across all categories)
  4. Inserts 4 realistic blog posts
  5. Creates 1 admin user  (admin@hdfclife.com / Admin@123)
  6. Creates 1 demo customer (demo@customer.com / Demo@123) with 2 sample policies
"""

import os
import sys
from datetime import datetime, timedelta, timezone

# ── Ensure we can import the app package from this script's location ──────────
# When run as: python app/seed.py  →  __file__ = .../backend/app/seed.py
# We need to add the backend/ directory (parent of app/) to sys.path
_script_dir = os.path.dirname(os.path.abspath(__file__))
_backend_dir = os.path.dirname(_script_dir)
sys.path.insert(0, _backend_dir)

from dotenv import load_dotenv

load_dotenv(os.path.join(_backend_dir, ".env"))

from pymongo import MongoClient

from app.models.blog import create_blog
from app.models.product import create_product
from app.models.user import create_user

MONGO_URI: str = os.getenv("MONGO_URI", "mongodb://localhost:27017/hdfc_life")


# ──────────────────────────────────────────────────────────────────────────────
# Seed data
# ──────────────────────────────────────────────────────────────────────────────

PRODUCTS = [
    # ── Life Insurance ────────────────────────────────────────────────────────
    create_product(
        name="HDFC Life Click 2 Protect Super",
        category="Life Insurance",
        description=(
            "A comprehensive term insurance plan offering life cover up to age 85 "
            "with flexible payout options and waiver of premium on critical illness."
        ),
        min_age=18,
        max_age=65,
        min_term=10,
        max_term=40,
        base_premium_rate=0.004,
        features=[
            "Life cover up to age 85",
            "Multiple payout options (lump sum, monthly income, increasing income)",
            "Accidental death benefit rider available",
            "Return of premium option at maturity",
            "Online purchase with instant policy issuance",
        ],
        benefits=[
            "Tax benefits under Section 80C and 10(10D)",
            "High sum assured discounts",
            "Non-smoker discounts",
            "Loyalty additions for long-term policies",
        ],
        eligibility=[
            "Indian resident aged 18–65 years",
            "Minimum annual income: ₹3,00,000",
            "Medical underwriting required above ₹75 lakhs",
        ],
        documents_required=[
            "Age proof (Aadhaar / PAN / Passport)",
            "Identity proof",
            "Address proof",
            "Income proof (latest ITR / Form 16)",
            "Medical reports (if applicable)",
        ],
    ),
    create_product(
        name="HDFC Life Sanchay Plus",
        category="Life Insurance",
        description=(
            "A guaranteed savings plan that provides assured returns along with life "
            "cover, ideal for long-term wealth creation and family protection."
        ),
        min_age=18,
        max_age=60,
        min_term=10,
        max_term=30,
        base_premium_rate=0.0045,
        features=[
            "Guaranteed maturity benefit",
            "Life cover throughout the policy term",
            "Flexible premium payment terms (5, 8, 10 years)",
            "Loan facility after 2 years",
            "Partial withdrawal option",
        ],
        benefits=[
            "Guaranteed returns regardless of market conditions",
            "Tax benefits under Section 80C",
            "Death benefit = higher of 10× annual premium or sum assured",
            "Surrender value after 2 years",
        ],
        eligibility=[
            "Indian resident aged 18–60 years",
            "Minimum annual premium: ₹24,000",
        ],
        documents_required=[
            "Age proof",
            "Identity proof",
            "Address proof",
            "Income proof",
        ],
    ),

    # ── Health Insurance ──────────────────────────────────────────────────────
    create_product(
        name="HDFC Life Optima Secure",
        category="Health Insurance",
        description=(
            "A comprehensive health insurance plan covering hospitalisation, "
            "day-care procedures, and modern treatments with no room-rent capping."
        ),
        min_age=18,
        max_age=65,
        min_term=1,
        max_term=3,
        base_premium_rate=0.006,
        features=[
            "No room-rent capping",
            "600+ day-care procedures covered",
            "Modern treatments including robotic surgery",
            "Restore benefit – automatic reinstatement of sum insured",
            "Global emergency cover",
        ],
        benefits=[
            "Cashless treatment at 10,000+ network hospitals",
            "No claim bonus up to 100 %",
            "Tax benefits under Section 80D",
            "Maternity and new-born cover available as add-on",
        ],
        eligibility=[
            "Indian resident aged 18–65 years",
            "Family floater option available",
            "Pre-existing diseases covered after 3-year waiting period",
        ],
        documents_required=[
            "Age proof",
            "Identity proof",
            "Address proof",
            "Previous health records (if applicable)",
        ],
    ),
    create_product(
        name="HDFC Life Cancer Care",
        category="Health Insurance",
        description=(
            "A dedicated cancer insurance plan providing financial support at all "
            "stages of cancer diagnosis with lump-sum and income benefits."
        ),
        min_age=18,
        max_age=65,
        min_term=5,
        max_term=20,
        base_premium_rate=0.0055,
        features=[
            "Coverage from early to major stage cancer",
            "Lump-sum payout on cancer diagnosis",
            "Monthly income benefit for 5 years on major stage",
            "Premium waiver on major-stage diagnosis",
            "Second medical opinion benefit",
        ],
        benefits=[
            "Tax benefits under Section 80D",
            "No hospitalisation required for claim",
            "Guaranteed renewability",
            "Coverage for 23 specific cancer types",
        ],
        eligibility=[
            "Indian resident aged 18–65 years",
            "No existing cancer diagnosis",
            "Medical underwriting may be required",
        ],
        documents_required=[
            "Age proof",
            "Identity proof",
            "Address proof",
            "Medical reports (if applicable)",
        ],
    ),

    # ── Investment Plans ──────────────────────────────────────────────────────
    create_product(
        name="HDFC Life ProGrowth Plus",
        category="Investment Plans",
        description=(
            "A unit-linked insurance plan (ULIP) offering market-linked returns with "
            "life cover. Choose from 10 fund options to match your risk profile."
        ),
        min_age=18,
        max_age=65,
        min_term=10,
        max_term=30,
        base_premium_rate=0.003,
        features=[
            "10 fund options from equity to debt",
            "Unlimited free switches between funds",
            "Partial withdrawal after 5-year lock-in",
            "Top-up premium option",
            "Loyalty additions from year 6 onwards",
        ],
        benefits=[
            "Market-linked wealth creation",
            "Life cover for family protection",
            "Tax benefits under Section 80C and 10(10D)",
            "No premium allocation charge from year 2",
        ],
        eligibility=[
            "Indian resident aged 18–65 years",
            "Minimum annual premium: ₹18,000",
        ],
        documents_required=[
            "Age proof",
            "Identity proof",
            "Address proof",
            "PAN card",
            "Income proof",
        ],
    ),

    # ── Retirement Plans ──────────────────────────────────────────────────────
    create_product(
        name="HDFC Life Pension Guaranteed Plan",
        category="Retirement Plans",
        description=(
            "A non-participating, non-linked annuity plan that guarantees a fixed "
            "income for life, providing complete financial independence in retirement."
        ),
        min_age=30,
        max_age=85,
        min_term=5,
        max_term=40,
        base_premium_rate=0.0035,
        features=[
            "Lifetime guaranteed income",
            "Multiple annuity options (single life, joint life, with return of purchase price)",
            "Immediate or deferred annuity",
            "Enhanced annuity for higher purchase price",
            "Joint life option covers spouse",
        ],
        benefits=[
            "Guaranteed income regardless of market performance",
            "Tax benefits under Section 80CCC",
            "Spouse continues to receive income after policyholder's death",
            "Option to receive purchase price back on death",
        ],
        eligibility=[
            "Indian resident aged 30–85 years",
            "Minimum purchase price: ₹1,00,000",
            "NRIs can purchase with repatriation benefits",
        ],
        documents_required=[
            "Age proof",
            "Identity proof",
            "Address proof",
            "PAN card",
            "Bank account details for annuity credit",
        ],
    ),
]


BLOGS = [
    create_blog(
        title="Why Term Insurance is the Smartest Financial Decision You'll Make",
        slug="why-term-insurance-is-smartest-financial-decision",
        category="Life Insurance",
        author="HDFC Life Editorial Team",
        content="""
## Why Term Insurance Should Be Your First Investment

Term insurance is the purest form of life insurance — you pay a small premium and get a large life cover. 
If something happens to you, your family receives the sum assured. If you outlive the policy, you've paid for peace of mind.

### Key Reasons to Buy Term Insurance Early

**1. Premiums Are Lowest When You're Young**
A 25-year-old non-smoker can get ₹1 crore cover for as little as ₹700/month. 
The same cover at age 35 might cost ₹1,200/month. Buy early, save more.

**2. Your Family's Future Is Protected**
Consider this: You earn ₹10 lakhs per year. Over the next 20 years, that's ₹2 crore+ of future earnings. 
Term insurance replaces this income for your family if you're not around.

**3. Tax Benefits Under Section 80C**
Premiums paid for term insurance are deductible up to ₹1.5 lakhs per year under Section 80C. 
The death benefit is also tax-free under Section 10(10D).

**4. Riders Add Comprehensive Protection**
Add riders like:
- Critical Illness Rider (waiver of premium + lump sum on diagnosis)
- Accidental Death Benefit (additional cover for accidents)
- Income Benefit Rider (monthly income for family)

### How Much Cover Do You Need?

A common thumb rule: **10–15× your annual income**. 
If you earn ₹8 lakhs/year, aim for ₹80 lakhs to ₹1.2 crore cover.

### The Bottom Line

At HDFC Life, our Click 2 Protect Super plan starts at ₹700/month for ₹1 crore cover. 
Don't wait — every year you delay costs you more in premiums.
        """.strip(),
        image_url="https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
        tags=["term insurance", "life cover", "financial planning", "tax benefits"],
        published=True,
    ),

    create_blog(
        title="Health Insurance in India: Everything You Need to Know in 2024",
        slug="health-insurance-india-complete-guide-2024",
        category="Health Insurance",
        author="Dr. Priya Sharma, Health Advisory",
        content="""
## Health Insurance in India: A Complete 2024 Guide

Medical inflation in India is running at 14% per year. A single hospitalisation for a cardiac procedure can cost ₹5–15 lakhs. 
Health insurance is no longer optional — it's essential.

### Types of Health Insurance Plans

**Individual Plans**
Cover only one person. Ideal if you're single or want separate limits for each family member.

**Family Floater Plans**
A single sum insured shared by the entire family. Cost-effective but the entire sum can be exhausted by one hospitalisation.

**Senior Citizen Plans**
Specifically designed for those above 60 with higher sub-limits for age-related conditions.

**Critical Illness Plans**
Provide a lump sum on diagnosis of specified diseases (cancer, heart attack, stroke, etc.)

### Key Features to Look For

- **Cashless Hospitalisation**: Choose a plan with your preferred hospital in the network.
- **No Room Rent Capping**: Avoid plans that limit the room category — it affects all other costs proportionately.
- **Restore Benefit**: Sum insured restored if exhausted within the year.
- **No Claim Bonus**: Get extra cover for claim-free years (up to 100% extra).
- **Pre-existing Disease Coverage**: 2–4 year waiting period is standard.

### How Much Cover Is Enough?

| City | Recommended Cover |
|------|------------------|
| Metro (Mumbai/Delhi/Bangalore) | ₹10–15 lakhs |
| Tier-2 Cities | ₹5–7 lakhs |
| Rural Areas | ₹3–5 lakhs |

### Tax Benefits

Premiums up to ₹25,000/year (₹50,000 for senior citizens) are deductible under Section 80D.

Choose HDFC Life Optima Secure for comprehensive coverage with zero room-rent capping.
        """.strip(),
        image_url="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800",
        tags=["health insurance", "mediclaim", "family floater", "Section 80D"],
        published=True,
    ),

    create_blog(
        title="ULIP vs Mutual Fund: Which Is Better for Long-Term Wealth Creation?",
        slug="ulip-vs-mutual-fund-long-term-wealth-creation",
        category="Investment Plans",
        author="Rajesh Kumar, CFP",
        content="""
## ULIPs vs Mutual Funds: Making the Right Choice

Both ULIPs (Unit Linked Insurance Plans) and Mutual Funds offer market-linked returns, but they serve different purposes. 
Here's a detailed comparison to help you choose.

### Key Differences

| Feature | ULIP | Mutual Fund |
|---------|------|-------------|
| Life Cover | ✅ Yes | ❌ No |
| Tax on Returns | Tax-free (10D) | 10% LTCG above ₹1L |
| Lock-in Period | 5 years | 3 years (ELSS only) |
| Charges | Mortality + fund charges | Only expense ratio |
| Flexibility | Fund switching included | Separate SIP/redemption |

### When Should You Choose ULIP?

✅ You want **life cover + investment** in one product  
✅ You're in the **30% tax bracket** (10(10D) exemption is valuable)  
✅ You want **disciplined, long-term** investing (5–20 years)  
✅ You need the **death benefit** for family protection  

### When Should You Choose Mutual Funds?

✅ You already have **adequate life insurance** separately  
✅ You want **maximum flexibility** with no lock-in (except ELSS)  
✅ You're comfortable with **direct market investing**  
✅ You need **lower charges** for pure wealth creation  

### HDFC Life ProGrowth Plus ULIP — Best of Both Worlds

Our ULIP offers:
- 10 fund options (equity, debt, balanced)
- Unlimited free switches
- Tax-free returns
- Life cover for your family

**Our Recommendation**: If you're starting from scratch, buy a term plan separately and invest in mutual funds OR buy a ULIP like ProGrowth Plus for the combined benefit at lower overall cost.
        """.strip(),
        image_url="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800",
        tags=["ULIP", "mutual fund", "investment", "wealth creation", "tax planning"],
        published=True,
    ),

    create_blog(
        title="Retirement Planning at 30: Why Starting Early Makes You a Crorepati",
        slug="retirement-planning-at-30-start-early-become-crorepati",
        category="Retirement Plans",
        author="Ananya Iyer, Retirement Specialist",
        content="""
## Start Retirement Planning at 30 — Here's Why

Most Indians start thinking about retirement at 50. By then, they've missed 20 years of compound growth. 
Starting at 30 means your money works for you for 30+ years. The results are staggering.

### The Power of Compounding

**Scenario 1**: Start at 30, invest ₹10,000/month for 30 years at 12% returns.  
**Corpus at 60**: ₹3.5 crore

**Scenario 2**: Start at 40, invest ₹20,000/month for 20 years at 12% returns.  
**Corpus at 60**: ₹2.0 crore

*Double the monthly investment but still 43% less corpus!*

### How Much Do You Need to Retire?

The **25× Rule**: Multiply your annual expenses by 25.  
If you spend ₹5 lakhs/year now and expect ₹8 lakhs/year at retirement (inflation-adjusted):  
**Target corpus = ₹8 lakhs × 25 = ₹2 crore**

### Retirement Planning Options in India

**1. NPS (National Pension System)**
- Tax deduction up to ₹2 lakhs (80C + 80CCD)
- Partial withdrawal allowed at 60
- Annuity mandatory for 40% of corpus

**2. EPF/VPF**
- 8.5% guaranteed returns
- Tax-free after 5 years
- Best for salaried individuals

**3. Pension Plans (like HDFC Life Pension Guaranteed)**
- Guaranteed lifetime income
- Protects against longevity risk
- Joint life option for spouse

**4. ULIP for Retirement**
- Market-linked growth for 20–30 years
- Tax-free maturity proceeds

### Our Recommendation

The best retirement strategy combines:
1. **EPF/NPS** for guaranteed base
2. **ULIP or Equity Mutual Funds** for growth
3. **Annuity Plan** for guaranteed lifetime income

Start today with HDFC Life Pension Guaranteed Plan — guaranteed income for life from just ₹1,000/month.
        """.strip(),
        image_url="https://images.unsplash.com/photo-1559526324-4b87b5e36e44?w=800",
        tags=["retirement planning", "pension", "annuity", "financial independence", "compounding"],
        published=True,
    ),
]


def run_seed():
    """Connect to MongoDB and seed all collections."""
    print(f"\n{'='*60}")
    print("  HDFC Life Insurance — Database Seed Script")
    print(f"{'='*60}\n")

    # ── Connect ───────────────────────────────────────────────────────────────
    print(f"► Connecting to MongoDB: {MONGO_URI}")
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        client.server_info()  # Trigger connection error early
        db = client.get_database()
        print("  ✔ Connected successfully.\n")
    except Exception as exc:
        print(f"  ✘ Connection failed: {exc}")
        sys.exit(1)

    # ── Drop & recreate collections ───────────────────────────────────────────
    collections = ["users", "products", "blogs", "leads", "claims"]
    print("► Dropping and recreating collections:")
    for col in collections:
        db.drop_collection(col)
        print(f"  ✔ {col}")
    print()

    # ── Seed Products ─────────────────────────────────────────────────────────
    print("► Seeding Products (6 products):")
    result = db.products.insert_many(PRODUCTS)
    print(f"  ✔ Inserted {len(result.inserted_ids)} products.\n")

    # ── Seed Blogs ────────────────────────────────────────────────────────────
    print("► Seeding Blogs (4 posts):")
    result = db.blogs.insert_many(BLOGS)
    print(f"  ✔ Inserted {len(result.inserted_ids)} blog posts.\n")

    # ── Seed Admin User ───────────────────────────────────────────────────────
    print("► Creating admin user (admin@hdfclife.com / Admin@123):")
    admin_doc = create_user(
        username="HDFC Admin",
        email="admin@hdfclife.com",
        password="Admin@123",
        role="admin",
        phone="9800000001",
        city="Mumbai",
    )
    db.users.insert_one(admin_doc)
    print("  ✔ Admin user created.\n")

    # ── Seed Demo Customer ────────────────────────────────────────────────────
    now = datetime.now(timezone.utc)
    demo_policies = [
        {
            "policy_id": "HDFC-LIFE-2022-001234",
            "plan_name": "HDFC Life Click 2 Protect Super",
            "sum_assured": 10_000_000,   # ₹1 crore
            "premium": 8_400,             # ₹8,400 / year
            "start_date": datetime(2022, 4, 1, tzinfo=timezone.utc),
            "end_date": datetime(2042, 3, 31, tzinfo=timezone.utc),
            "status": "active",
        },
        {
            "policy_id": "HDFC-HEALTH-2023-005678",
            "plan_name": "HDFC Life Optima Secure",
            "sum_assured": 1_000_000,    # ₹10 lakhs
            "premium": 15_600,            # ₹15,600 / year
            "start_date": datetime(2023, 1, 15, tzinfo=timezone.utc),
            "end_date": datetime(2024, 1, 14, tzinfo=timezone.utc),
            "status": "active",
        },
    ]

    print("► Creating demo customer (demo@customer.com / Demo@123) with 2 policies:")
    demo_doc = create_user(
        username="Demo Customer",
        email="demo@customer.com",
        password="Demo@123",
        role="customer",
        phone="9800000002",
        city="Bangalore",
        policies=demo_policies,
    )
    db.users.insert_one(demo_doc)
    print("  ✔ Demo customer created with 2 active policies.\n")

    # ── Create Indexes ────────────────────────────────────────────────────────
    print("► Creating indexes:")
    db.users.create_index("email", unique=True)
    db.products.create_index("category")
    db.blogs.create_index("slug", unique=True)
    db.leads.create_index("status")
    db.claims.create_index("user_id")
    print("  ✔ Indexes created.\n")

    print(f"{'='*60}")
    print("  ✔ Seed completed successfully!")
    print(f"{'='*60}\n")
    print("  Admin     → admin@hdfclife.com   / Admin@123")
    print("  Customer  → demo@customer.com    / Demo@123")
    print(f"\n{'='*60}\n")

    client.close()


if __name__ == "__main__":
    run_seed()
