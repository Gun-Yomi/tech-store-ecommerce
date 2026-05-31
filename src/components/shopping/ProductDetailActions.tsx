"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useActionState, useState } from "react";
import {
  addToCartAction,
  addToWishlistAction,
  saveProductForLaterAction,
  type ShoppingActionState,
} from "@/lib/shopping-actions";
import { ActionMessage } from "./ActionMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: ShoppingActionState = {};

type ProductDetailActionsProps = {
  productId: string;
  productName: string;
  stockQuantity: number;
};

export function ProductDetailActions({
  productId,
  productName,
  stockQuantity,
}: ProductDetailActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [cartState, cartAction] = useActionState(addToCartAction, initialState);
  const [wishlistState, wishlistAction] = useActionState(
    addToWishlistAction,
    initialState,
  );
  const [savedState, savedAction] = useActionState(
    saveProductForLaterAction,
    initialState,
  );
  const visibleState =
    cartState.formError || cartState.successMessage
      ? cartState
      : wishlistState.formError || wishlistState.successMessage
        ? wishlistState
        : savedState;
  const outOfStock = stockQuantity < 1;

  return (
    <div className="mt-5 space-y-4">
      <label className="block max-w-40">
        <span className="text-xs font-black uppercase tracking-[0.14em] text-[#2f7fb3]">
          Quantity
        </span>
        <input
          type="number"
          min={1}
          max={Math.max(1, stockQuantity)}
          value={quantity}
          onChange={(event) => setQuantity(Math.max(1, Number(event.target.value) || 1))}
          className="mt-2 h-12 w-full rounded-lg border border-[#cfe0f2] bg-white px-4 text-sm font-black text-[#1f2a44] outline-none transition hover:border-[#9fc5e8] focus:border-[#4f9ed8] focus:ring-4 focus:ring-[#dff0ff]"
        />
      </label>

      <div className="grid gap-3 sm:grid-cols-3">
        <form action={cartAction}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value={quantity} />
          <SubmitButton
            pendingLabel="Adding..."
            disabled={outOfStock}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-[#4f9ed8] px-4 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to cart
          </SubmitButton>
        </form>
        <form action={wishlistAction}>
          <input type="hidden" name="productId" value={productId} />
          <SubmitButton
            pendingLabel="Saving..."
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-lg border border-[#9fc5e8] bg-white px-4 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
          >
            <Heart className="h-4 w-4" />
            Wishlist
          </SubmitButton>
        </form>
        <form action={savedAction}>
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value={quantity} />
          <SubmitButton
            pendingLabel="Saving..."
            className="inline-flex h-12 w-full items-center justify-center rounded-lg border border-[#9fc5e8] bg-white px-4 text-sm font-black text-[#334155] transition hover:border-[#4f9ed8] hover:bg-[#eaf6ff]"
          >
            Save for later
          </SubmitButton>
        </form>
      </div>

      {outOfStock ? (
        <p className="rounded-lg border border-[#e7b5ae] bg-[#fff3f1] px-3 py-2 text-xs font-bold text-[#9f2f28]">
          {productName} is currently out of stock.
        </p>
      ) : null}
      <ActionMessage state={visibleState} />
    </div>
  );
}
