"use server";

import { revalidatePath } from "next/cache";
import { query } from "@/lib/db";

export type JoinState = {
  ok: boolean;
  message: string;
};

export async function joinParty(
  _previousState: JoinState,
  formData: FormData,
): Promise<JoinState> {
  const name = String(formData.get("name") ?? "").trim();
  const graduationYear = Number(formData.get("graduationYear"));
  const partyMood = String(formData.get("partyMood") ?? "").trim();

  if (name.length < 2) {
    return { ok: false, message: "이름을 2자 이상 입력해 주세요." };
  }

  if (!Number.isInteger(graduationYear) || graduationYear < 1950 || graduationYear > 2035) {
    return { ok: false, message: "졸업연도를 올바르게 입력해 주세요." };
  }

  await query(
    `
      insert into party_registrations (name, graduation_year, party_mood)
      values ($1, $2, $3)
    `,
    [name, graduationYear, partyMood || null],
  );

  revalidatePath("/");
  return { ok: true, message: "참가 신청이 저장되었습니다." };
}

