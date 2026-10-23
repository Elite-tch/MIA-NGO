import { NextResponse } from "next/server";
import {
  getStoredCareers,
  saveSingleCareer,
  deleteStoredCareer,
} from "../../lib/db";
import { CareerItem } from "../../data/careersData";

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function GET() {
  try {
    const careers = await getStoredCareers();
    return NextResponse.json(careers);
  } catch {
    return NextResponse.json({ error: "Failed to fetch careers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.title || !body.summary) {
      return NextResponse.json(
        { error: "Title and summary are required fields." },
        { status: 400 }
      );
    }

    const currentCareers = await getStoredCareers();
    const baseSlug = createSlug(body.title);
    let finalSlug = baseSlug || `role-${Date.now()}`;

    // Ensure unique slug
    let counter = 1;
    while (currentCareers.some((item) => item.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newCareer: CareerItem = {
      id: `job-${Date.now()}`,
      slug: finalSlug,
      title: body.title,
      type: body.type || "Paid",
      department: body.department || "Clinical & Field Operations",
      location: body.location || "Regional Hub & Outreach Centers",
      commitment: body.commitment || "Full-Time",
      applyEmail:
        body.applyEmail ||
        (body.type === "Volunteer"
          ? "volunteer@maternalinitiativeafrica.org"
          : "careers@maternalinitiativeafrica.org"),
      deadline: body.deadline || "Rolling Admissions",
      summary: body.summary,
      status: body.status === "draft" ? "draft" : "published",
      aboutRole: body.aboutRole || body.summary,
      responsibilities:
        Array.isArray(body.responsibilities) && body.responsibilities.length > 0
          ? body.responsibilities
          : [
              "Support frontline clinical and operational activities in designated districts.",
              "Collaborate with nursing leadership to maintain care protocols and field reporting.",
              "Participate in regular team coordination meetings and clinical debriefs.",
            ],
      requirements:
        Array.isArray(body.requirements) && body.requirements.length > 0
          ? body.requirements
          : [
              "Demonstrated dedication to maternal and newborn health in Africa.",
              "Strong collaborative spirit, cultural empathy, and problem-solving mindset.",
              "Relevant professional or academic credentials in public health, nursing, or administration.",
            ],
    };

    await saveSingleCareer(newCareer);

    return NextResponse.json({ success: true, career: newCareer }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save career opportunity" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    const currentCareers = await getStoredCareers();
    const existing = currentCareers.find((item) => item.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Opportunity not found" }, { status: 404 });
    }

    const updatedCareer: CareerItem = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      type: body.type !== undefined ? body.type : existing.type,
      department: body.department !== undefined ? body.department : existing.department,
      location: body.location !== undefined ? body.location : existing.location,
      commitment: body.commitment !== undefined ? body.commitment : existing.commitment,
      applyEmail: body.applyEmail !== undefined ? body.applyEmail : existing.applyEmail,
      deadline: body.deadline !== undefined ? body.deadline : existing.deadline,
      summary: body.summary !== undefined ? body.summary : existing.summary,
      aboutRole: body.aboutRole !== undefined ? body.aboutRole : existing.aboutRole,
      status:
        body.status !== undefined
          ? body.status === "draft"
            ? "draft"
            : "published"
          : existing.status || "published",
      responsibilities: Array.isArray(body.responsibilities)
        ? body.responsibilities
        : existing.responsibilities,
      requirements: Array.isArray(body.requirements)
        ? body.requirements
        : existing.requirements,
    };

    await saveSingleCareer(updatedCareer);

    return NextResponse.json({ success: true, career: updatedCareer });
  } catch {
    return NextResponse.json({ error: "Failed to update opportunity" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Role ID is required" }, { status: 400 });
    }

    await deleteStoredCareer(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete role" }, { status: 500 });
  }
}
