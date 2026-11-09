import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, Mock, vi } from "vitest";
import { CartView } from "@/components/CartView";
import { CartProvider } from "@/context/CartContext";
import type { CartState } from "@/types/cart";

function renderCartView(
  initialState: CartState,
  onConfirm = vi.fn(),
): { onConfirm: Mock<() => void> } {
  render(
    <CartProvider initialState={initialState}>
      <CartView onConfirm={onConfirm} />
    </CartProvider>,
  );

  return { onConfirm };
}

const emptyState: CartState = { items: [] };

const stateWithItems: CartState = {
  items: [
    {
      product: { id: 19, name: "Muffin de chocolate", price: 2500 },
      quantity: 2,
    },
    {
      product: { id: 20, name: "Torta selva negra", price: 4200 },
      quantity: 1,
    },
  ],
};

describe("CartView", () => {
  it("shows an empty-cart message when there are no items", () => {
    renderCartView(emptyState);

    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("lists every item with its name, quantity and line subtotal", () => {
    renderCartView(stateWithItems);

    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
    expect(screen.getByTestId("quantity-19")).toHaveTextContent("2");
    expect(screen.getByText("$5.000")).toBeInTheDocument();

    expect(screen.getByText("Torta selva negra")).toBeInTheDocument();
    expect(screen.getByText("$4.200")).toBeInTheDocument();
  });

  it("shows the total subtotal across all items", () => {
    renderCartView(stateWithItems);

    expect(screen.getByText("$9.200")).toBeInTheDocument();
  });

  it("increments an item's quantity when its + button is clicked", async () => {
    const user = userEvent.setup();
    renderCartView(stateWithItems);

    await user.click(
      screen.getByRole("button", {
        name: /aumentar cantidad de muffin de chocolate/i,
      }),
    );

    expect(screen.getByTestId("quantity-19")).toHaveTextContent("3");
    expect(screen.getByText("$7.500")).toBeInTheDocument();
  });

  it("decrements an item's quantity when its - button is clicked", async () => {
    const user = userEvent.setup();
    renderCartView(stateWithItems);

    await user.click(
      screen.getByRole("button", {
        name: /disminuir cantidad de muffin de chocolate/i,
      }),
    );

    expect(screen.getByTestId("quantity-19")).toHaveTextContent("1");
    expect(screen.getByText("$2.500")).toBeInTheDocument();
  });

  it("removes the item from the list once its quantity reaches 0", async () => {
    const user = userEvent.setup();
    renderCartView({
      items: [
        {
          product: { id: 19, name: "Muffin de chocolate", price: 2500 },
          quantity: 1,
        },
      ],
    });

    await user.click(
      screen.getByRole("button", {
        name: /disminuir cantidad de muffin de chocolate/i,
      }),
    );

    expect(screen.queryByText("Muffin de chocolate")).not.toBeInTheDocument();
    expect(screen.getByText(/tu carrito está vacío/i)).toBeInTheDocument();
  });

  it("removes an item immediately when its remove button is clicked", async () => {
    const user = userEvent.setup();
    renderCartView(stateWithItems);

    await user.click(screen.getByRole("button", { name: /eliminar muffin de chocolate/i }));

    expect(screen.queryByText("Muffin de chocolate")).not.toBeInTheDocument();
    expect(screen.getByText("Torta selva negra")).toBeInTheDocument();
  });

  it("disables the confirm button when the cart is empty", () => {
    renderCartView(emptyState);

    expect(screen.getByRole("button", { name: /confirmar pedido/i })).toBeDisabled();
  });

  it("enables the confirm button when the cart has at least one item", () => {
    renderCartView(stateWithItems);

    expect(screen.getByRole("button", { name: /confirmar pedido/i })).toBeEnabled();
  });

  it("calls onConfirm when the confirm button is clicked with items in the cart", async () => {
    const user = userEvent.setup();
    const { onConfirm } = renderCartView(stateWithItems);

    await user.click(screen.getByRole("button", { name: /confirmar pedido/i }));

    expect(onConfirm).toHaveBeenCalledOnce();
  });
});
