"use client";

import { useActionState, useState } from "react";
import {
  moveCartItemToSavedAction,
  removeCartItemAction,
  updateCartItemQuantityAction,
  type ShoppingActionState,
} from "@/lib/shopping-actions";
import { ActionMessage } from "./ActionMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: ShoppingActionState = {};

type CartItemControlsProps = {
  cartItemId: string;
  initialQuantity: number;
  maxQuantity: number;
};

export function CartItemControls({
  cartItemId,
  initialQuantity,
  maxQuantity,
}: CartItemControlsProps) {
  const [quantity, setQuantity] = useState(initialQuantity);
  const [updateState, updateAction] = useActionState(
    updateCartItemQuantityAction,
    initialState,
  );
  const [removeState, removeAction] = useActionState(
    removeCartItemAction,
    initialState,
  );
  const [saveState, saveAction] = useActionState(
    moveCartItemToSavedAction,
    initialState,
  );
  const visibleState =
    updateState.formError || updateState.successMessage
      ? updateState
      : removeState.formError || removeState.successMessage
        ? removeState
        : saveState;

  return (
    <div className="space-y-3">
      <form action={updateAction} className="flex flex-wrap items-end gap-2">
        <input type="hidden" name="cartItemId" value={cartItemId} />
        <label className="block">
          <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
            Quantity
          </span>
          <input
            name="quantity"
            type="number"
            min={1}
            max={Math.max(1, maxQuantity)}
            value={quantity}
            onChange={(event) =>
              setQuantity(Math.max(1, Number(event.target.value) || 1))
            }
            className="mt-2 h-11 w-24 rounded-lg border border-[#cfe0f2] bg-white px-3 text-sm font-black text-[#1f2a44] outline-none transition hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
          />
        </label>
        <SubmitButton
          pendingLabel="Updating..."
          className="inline-flex h-11 items-center justify-center rounded-lg bg-[#334155] px-4 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
        >
          Update
        </SubmitButton>
      </form>

      <div className="flex flex-wrap gap-2">
        <form action={saveAction}>
          <input type="hidden" name="cartItemId" value={cartItemId} />
          <SubmitButton
            pendingLabel="Moving..."
            className="inline-flex h-10 items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-4 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
          >
            Save for later
          </SubmitButton>
        </form>
        <form action={removeAction}>
          <input type="hidden" name="cartItemId" value={cartItemId} />
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
