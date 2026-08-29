"use client";

import { useActionState } from "react";
import { joinParty, type JoinState } from "@/app/actions";

const initialState: JoinState = {
  ok: false,
  message: "",
};

type PartyJoinFormProps = {
  disabled?: boolean;
};

export function PartyJoinForm({ disabled = false }: PartyJoinFormProps) {
  const [state, formAction, pending] = useActionState(joinParty, initialState);

  return (
    <form className="joinForm" action={formAction}>
      <h2>파티 참가 신청</h2>
      <fieldset disabled={disabled || pending}>
        <div className="field">
          <label htmlFor="name">이름</label>
          <input id="name" name="name" minLength={2} required placeholder="홍길동" />
        </div>
        <div className="field">
          <label htmlFor="graduationYear">졸업연도</label>
          <input
            id="graduationYear"
            name="graduationYear"
            type="number"
            min={1950}
            max={2035}
            required
            placeholder="2012"
          />
        </div>
        <div className="field">
          <label htmlFor="partyMood">원하는 분위기</label>
          <textarea
            id="partyMood"
            name="partyMood"
            placeholder="오랜 친구들과 편하게 이야기하고 싶어요."
          />
        </div>
      </fieldset>
      <button type="submit" disabled={disabled || pending}>
        {pending ? "저장 중" : "신청 저장"}
      </button>
      {disabled ? <p className="formMessage error">DATABASE_URL 설정 후 신청을 받을 수 있습니다.</p> : null}
      {state.message ? (
        <p className={state.ok ? "formMessage" : "formMessage error"}>{state.message}</p>
      ) : null}
    </form>
  );
}
