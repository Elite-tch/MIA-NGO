export interface ResourceItem {
  id: string;
  slug: string;
  title: string;
  tag: "Health Education" | "Clinical Brief" | "Field Research" | "News & Campaigns";
  date: string;
  readTime: string;
  image: string;
  summary: string;
  author: {
    name: string;
    role: string;
  };
  content: {
    intro: string;
    sections: {
      heading: string;
      body: string;
    }[];
    takeaways: string[];
  };
  status?: "published" | "draft";
}

export const resourcesData: ResourceItem[] = [
  {
    id: "res-1",
    slug: "antenatal-care-guide",
    title: "Understanding Antenatal Care: A Guide for Expectant Mothers",
    tag: "Health Education",
    date: "October 18, 2026",
    readTime: "5 min read",
    image: "/outreach/outreach-1.jpg",
    summary:
      "A practical overview of what expectant mothers should expect during routine prenatal visits, why early clinical contact is vital, and how to identify danger signs early.",
    author: {
      name: "Dr. Amina Juma",
      role: "Clinical Director, MIA",
    },
    content: {
      intro:
        "Antenatal care (ANC) is more than healthcare visits; it is an essential lifeline that bridges expectant mothers with clinical expertise, nutritional support, and emergency obstetric preparedness.",
      sections: [
        {
          heading: "The Critical Importance of the First Trimester",
          body: "The World Health Organization recommends at least eight antenatal contacts throughout pregnancy. Attending the first visit within the initial 12 weeks allows midwives to establish baseline maternal health, screen for preexisting conditions such as hypertension and anemia, and start essential folic acid and iron supplementation.",
        },
        {
          heading: "Key Danger Signs Every Family Should Know",
          body: "Education is maternal protection. During every checkup, MIA frontline nurses train mothers and family members to immediately seek emergency care if they experience severe headaches, blurred vision, sudden swelling of hands and face, vaginal bleeding, or reduced fetal movement.",
        },
        {
          heading: "Individualized Birth Preparedness",
          body: "Having a verified delivery plan — identifying the nearest equipped health facility, arranging pre-planned emergency transport, and having clean delivery materials ready — significantly reduces the fatal 'third delay' in obstetric emergencies.",
        },
      ],
      takeaways: [
        "Attend at least 8 antenatal checkups throughout pregnancy.",
        "Early blood pressure and hemoglobin screenings prevent complications.",
        "Recognize warning signs early: persistent headaches, vision changes, or bleeding.",
        "Have an emergency transport plan agreed upon with family and community health workers.",
      ],
    },
  },
  {
    id: "res-2",
    slug: "telehealth-rural-communities",
    title: "Telehealth in Rural Africa: Closing the Distance Gap in Obstetric Care",
    tag: "Clinical Brief",
    date: "October 12, 2026",
    readTime: "6 min read",
    image: "/outreach/outreach-3.jpg",
    summary:
      "How low-bandwidth digital tools and nurse-led mobile consultations connect village health posts with specialized OB-GYN physicians to manage complicated deliveries.",
    author: {
      name: "Tariq Mwangi",
      role: "Head of Digital Health, MIA",
    },
    content: {
      intro:
        "Geographic isolation should never be a death sentence. By leveraging mobile connectivity and standardized clinical algorithms, MIA's digital health initiative is transforming how emergency obstetric advice reaches remote settlements.",
      sections: [
        {
          heading: "The Challenge of Referral Delays",
          body: "In many rural districts, referral facilities are located over 50 kilometers away across difficult terrain. Frontline midwives at rural health posts often face acute complications like eclampsia or postpartum hemorrhage without immediate access to specialist doctors.",
        },
        {
          heading: "Real-Time Clinical Decision Support",
          body: "MIA equips rural nurses with rugged digital tablets pre-loaded with clinical triage protocols. In emergency scenarios, nurses initiate secure video or audio consultations with regional clinical mentors to stabilize mothers before or during transit.",
        },
        {
          heading: "Data Privacy and Local Adoption",
          body: "Our digital systems operate on low-bandwidth networks and local offline storage, ensuring that patient records remain secure while clinical advice flows seamlessly across borders.",
        },
      ],
      takeaways: [
        "Low-bandwidth telemedicine resolves referral delays in primary clinics.",
        "Real-time clinical consultations empower midwives to stabilize acute obstetric emergencies.",
        "Standardized mobile protocols improve adherence to life-saving clinical guidelines.",
      ],
    },
  },
  {
    id: "res-3",
    slug: "clean-delivery-kits-impact",
    title: "The Life-Saving Power of Clean Delivery Kits in Hard-to-Reach Villages",
    tag: "Field Research",
    date: "October 05, 2026",
    readTime: "4 min read",
    image: "/outreach/outreach-5.jpg",
    summary:
      "Evaluating outcomes from the distribution of sterile birth supplies and prenatal vitamins across rural community mobile outreaches in Sub-Saharan Africa.",
    author: {
      name: "Dr. Sarah Banda",
      role: "Head of Research & Data, MIA",
    },
    content: {
      intro:
        "Puerperal sepsis and neonatal infections remain leading causes of preventable deaths during home and rural clinic births. Clean delivery kits provide an immediate, cost-effective defense.",
      sections: [
        {
          heading: "What Makes an Effective Delivery Kit?",
          body: "Each MIA Maternal Health Kit contains essential sterile items recommended by the WHO: a clean plastic sheet, sterile blade for cord cutting, sterile cord ties, soap for hand hygiene, chlorhexidine for umbilical cord care, and clean swaddling blankets.",
        },
        {
          heading: "Documented Reductions in Sepsis",
          body: "Our field surveillance indicates that distributing kits alongside nurse-led hygiene counseling yields up to a 40% reduction in reported post-delivery neonatal and maternal bacterial infections in participating communities.",
        },
        {
          heading: "Coupling Distribution with Education",
          body: "Distributing supplies alone is not enough. MIA combines kit handoffs with practical demonstration workshops led by midwives, ensuring community birth assistants adhere strictly to antiseptic protocols.",
        },
      ],
      takeaways: [
        "Sterile delivery supplies directly prevent puerperal sepsis and neonatal tetanus.",
        "Chlorhexidine application to the umbilical cord significantly lowers infant infection rates.",
        "Kits must always be accompanied by interactive community hygiene training.",
      ],
    },
  },
  {
    id: "res-4",
    slug: "newborn-resuscitation-protocols",
    title: "Essential Newborn Care: Frontline Resuscitation Protocols for Midwives",
    tag: "Clinical Brief",
    date: "September 28, 2026",
    readTime: "7 min read",
    image: "/outreach/outreach-4.jpg",
    summary:
      "A clinical review of Helping Babies Breathe (HBB) techniques, thermal control, and immediate kangaroo mother care in low-resource maternity settings.",
    author: {
      name: "Grace Adebayo",
      role: "Head of Outreach & Field Delivery, MIA",
    },
    content: {
      intro:
        "The first 60 seconds after birth — known as the Golden Minute — determine whether a newborn who does not breathe spontaneously will survive without neurological damage.",
      sections: [
        {
          heading: "The Golden Minute Algorithm",
          body: "Every midwife must be trained to dry the baby thoroughly, assess breathing, clear airways if obstructed, and immediately initiate bag-and-mask ventilation if the infant does not cry within the first minute of life.",
        },
        {
          heading: "Thermal Regulation and Hypothermia Prevention",
          body: "Neonatal hypothermia is an underappreciated killer. Immediate skin-to-skin contact with the mother, covered by a warm, dry cloth, provides natural thermal regulation superior to unheated mechanical warmers.",
        },
        {
          heading: "Supportive Nursing Education",
          body: "MIA conducts hands-on simulation drills using clinical mannequins, ensuring that every nurse in our continental network maintains muscle memory for emergency newborn resuscitation.",
        },
      ],
      takeaways: [
        "Immediate ventilation within the Golden Minute saves non-breathing newborns.",
        "Skin-to-skin kangaroo care is critical for preventing lethal hypothermia.",
        "Regular simulation drills build confidence and rapid response in frontline maternity staff.",
      ],
    },
  },
  {
    id: "res-5",
    slug: "maternal-nutrition-sub-saharan-africa",
    title: "Community Nutrition Workshops: Fighting Anemia in Expectant Mothers",
    tag: "Health Education",
    date: "September 19, 2026",
    readTime: "5 min read",
    image: "/outreach/outreach-2.jpg",
    summary:
      "Addressing micronutrient deficiencies through locally sourced indigenous foods, iron supplementation, and participatory cooking demonstrations in rural villages.",
    author: {
      name: "Nestory Millanzi",
      role: "Executive Director, MIA",
    },
    content: {
      intro:
        "Maternal anemia doubles the risk of death from postpartum hemorrhage. Addressing nutritional vulnerabilities during pregnancy is one of the most cost-effective clinical investments available.",
      sections: [
        {
          heading: "The Silent Toll of Maternal Anemia",
          body: "Iron deficiency anemia weakens the mother's cardiovascular reserve. When hemorrhage occurs during delivery, an anemic mother can succumb in minutes to blood loss that a healthy mother could survive.",
        },
        {
          heading: "Championing Indigenous Nutrient-Dense Foods",
          body: "Rather than prescribing unaffordable imported diets, MIA nurses work with community women to identify indigenous leafy vegetables, legumes, and iron-rich local staples that are easily grown and prepared.",
        },
        {
          heading: "Tracking Hemoglobin at Mobile Clinics",
          body: "MIA mobile outreaches provide on-the-spot digital hemoglobin testing, dispensing iron and folic acid supplements directly to mothers who show signs of mild to moderate anemia.",
        },
      ],
      takeaways: [
        "Anemia drastically increases the mortality risk from postpartum hemorrhage.",
        "Community nutrition education should center on accessible, indigenous African food crops.",
        "Routine hemoglobin screening at mobile clinics ensures timely supplementation.",
      ],
    },
  },
  {
    id: "res-6",
    slug: "nurses-network-expansion-2026",
    title: "Africa Nurses Network Expands Continental Mentorship to 10 New Districts",
    tag: "News & Campaigns",
    date: "September 10, 2026",
    readTime: "4 min read",
    image: "/outreach/outreach-6.jpg",
    summary:
      "MIA launches the second cohort of its cross-border peer mentorship program, uniting 250 practicing midwives and nurse educators across Sub-Saharan Africa.",
    author: {
      name: "Kofi Mensah",
      role: "Network Coordinator, MIA",
    },
    content: {
      intro:
        "Following the success of our pilot phase, Maternal Initiative Africa is expanding the Africa Nurses Network to provide clinical masterclasses, digital protocols, and peer support to hundreds of frontline health workers.",
      sections: [
        {
          heading: "Bridging Senior Midwives with Rural Practitioners",
          body: "The expansion pairs experienced hospital midwifery tutors with young community nurses stationed in rural clinics, creating a direct mentorship channel for discussing challenging cases and debriefing complex deliveries.",
        },
        {
          heading: "Monthly Digital Clinical Masterclasses",
          body: "The new cohort will participate in monthly interactive webinars covering eclampsia management, early sepsis identification, and respectful maternity care.",
        },
        {
          heading: "Open Invitation to Clinicians",
          body: "Registration for the network remains 100% free for all nurses, midwives, and nursing students across Africa through our online portal.",
        },
      ],
      takeaways: [
        "The network connects 250+ frontline midwives across 10 underserved districts.",
        "Monthly masterclasses focus on managing obstetric emergencies.",
        "Membership is completely free for all practicing African nurses and midwives.",
      ],
    },
  },
];

export function getAllResources() {
  return resourcesData;
}

export function getResourceBySlug(slug: string): ResourceItem | undefined {
  return resourcesData.find((r) => r.slug === slug);
}
