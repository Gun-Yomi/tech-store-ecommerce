"use client";

import { useActionState } from "react";
import {
  moveSavedItemToCartAction,
  removeSavedItemAction,
  type ShoppingActionState,
} from "@/lib/shopping-actions";
import { ActionMessage } from "./ActionMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: ShoppingActionState = {};

type SavedItemControlsProps = {
  savedItemId: string;
  outOfStock: boolean;
};

export function SavedItemControls({
  savedItemId,
  outOfStock,
}: SavedItemControlsProps) {
  const [moveState, moveAction] = useActionState(
    moveSavedItemToCartAction,
    initialState,
  );
  const [removeState, removeAction] = useActionState(
    removeSavedItemAction,
    initialState,
  );
  const visibleState =
    moveState.formError || moveState.successMessage ? moveState : removeState;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <form action={moveAction}>
          <input type="hidden" name="savedItemId" value={savedItemId} />
          <SubmitButton
            pendingLabel="Moving..."
            disabled={outOfStock}
            className="inline-flex h-10 items-center justify-center rounded-lg bg-[#6e8f3d] px-4 text-sm font-black text-white transition hover:bg-[#5f7d33]"
          >
            Move to cart
          </SubmitButton>
        </form>
        <form action={removeAction}>
          <input type="hidden" name="savedItemId" value={savedItemId} />
          <SubmitButton
            pendingLabel="Removing..."
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#e7b5ae] bg-white px-4 text-sm font-black text-[#9f2f28] transition hover:bg-[#fff3f1]"
          >
            Remove
          </SubmitButton>
        </form>
      </div>
      <ActionMessage state={visibleState} />
    </div>
  );
}
