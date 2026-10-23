import { NextResponse } from "next/server";
import {
  getStoredResources,
  saveSingleResource,
  deleteStoredResource,
} from "../../lib/db";
import { ResourceItem } from "../../data/resourcesData";

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
    const resources = await getStoredResources();
    return NextResponse.json(resources);
  } catch {
    return NextResponse.json({ error: "Failed to fetch resources" }, { status: 500 });
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

    const currentResources = await getStoredResources();
    const baseSlug = createSlug(body.title);
    let finalSlug = baseSlug || `article-${Date.now()}`;

    // Ensure unique slug
    let counter = 1;
    while (currentResources.some((item) => item.slug === finalSlug)) {
      finalSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    const newResource: ResourceItem = {
      id: `res-${Date.now()}`,
      slug: finalSlug,
      title: body.title,
      tag: body.tag || "Health Education",
      date:
        body.date ||
        new Date().toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        }),
      readTime: body.readTime || "5 min read",
      image: body.image || "/outreach/outreach-1.jpg",
      summary: body.summary,
      status: body.status === "draft" ? "draft" : "published",
      author: {
        name: body.authorName || "MIA Clinical Communications",
        role: body.authorRole || "Editorial & Field Medical Team",
      },
      content: {
        intro: body.intro || body.summary,
        sections: Array.isArray(body.sections) ? body.sections : [],
        takeaways: Array.isArray(body.takeaways) ? body.takeaways : [],
      },
    };

    // Persist individual document to Firestore
    await saveSingleResource(newResource);

    return NextResponse.json({ success: true, resource: newResource }, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to save resource article" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    const currentResources = await getStoredResources();
    const existing = currentResources.find((item) => item.id === body.id);
    if (!existing) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    const updatedResource: ResourceItem = {
      ...existing,
      title: body.title !== undefined ? body.title : existing.title,
      tag: body.tag !== undefined ? body.tag : existing.tag,
      date: body.date !== undefined ? body.date : existing.date,
      readTime: body.readTime !== undefined ? body.readTime : existing.readTime,
      image: body.image !== undefined ? body.image : existing.image,
      summary: body.summary !== undefined ? body.summary : existing.summary,
      status:
        body.status !== undefined
          ? body.status === "draft"
            ? "draft"
            : "published"
          : existing.status || "published",
      author: {
        name: body.authorName !== undefined ? body.authorName : existing.author.name,
        role: body.authorRole !== undefined ? body.authorRole : existing.author.role,
      },
      content: {
        intro: body.intro !== undefined ? body.intro : existing.content.intro,
        sections: Array.isArray(body.sections) ? body.sections : existing.content.sections,
        takeaways: Array.isArray(body.takeaways)
          ? body.takeaways
          : existing.content.takeaways,
      },
    };

    // Upsert to Firestore
    await saveSingleResource(updatedResource);

    return NextResponse.json({ success: true, resource: updatedResource });
  } catch {
    return NextResponse.json({ error: "Failed to update article" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 });
    }

    await deleteStoredResource(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete article" }, { status: 500 });
  }
}
