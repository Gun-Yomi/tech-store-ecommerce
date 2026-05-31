"use client";

import { Heart, ShoppingBag } from "lucide-react";
import { useActionState } from "react";
import {
  addToCartAction,
  addToWishlistAction,
  type ShoppingActionState,
} from "@/lib/shopping-actions";
import { ActionMessage } from "./ActionMessage";
import { SubmitButton } from "./SubmitButton";

const initialState: ShoppingActionState = {};

type ProductQuickActionsProps = {
  productId: string;
  productName: string;
  outOfStock: boolean;
};

export function ProductQuickActions({
  productId,
  productName,
  outOfStock,
}: ProductQuickActionsProps) {
  const [cartState, cartAction] = useActionState(addToCartAction, initialState);
  const [wishlistState, wishlistAction] = useActionState(
    addToWishlistAction,
    initialState,
  );
  const visibleState = cartState.formError || cartState.successMessage ? cartState : wishlistState;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <form action={wishlistAction}>
          <input type="hidden" name="productId" value={productId} />
          <SubmitButton
            pendingLabel="..."
            ariaLabel={`Add ${productName} to wishlist`}
            title="Add to wishlist"
            className="grid h-11 w-11 place-items-center rounded-lg border border-[#cfe0f2] bg-white text-[#334155] transition hover:border-[#76b7e5] hover:bg-[#e8f4ff]"
          >
            <Heart className="h-4 w-4" />
          </SubmitButton>
        </form>
        <form action={cartAction} className="flex-1">
          <input type="hidden" name="productId" value={productId} />
          <input type="hidden" name="quantity" value="1" />
          <SubmitButton
            pendingLabel="Adding..."
            disabled={outOfStock}
            ariaLabel={`Add ${productName} to cart`}
            title={outOfStock ? "Out of stock" : "Add to cart"}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#4f9ed8] px-4 text-sm font-black text-white transition hover:bg-[#2f7fb3]"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to cart
          </SubmitButton>
        </form>
      </div>
      <ActionMessage state={visibleState} />
    </div>
  );
}
