import { RenderResult, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ReactElement } from "react";
import { describe, expect, it } from "vitest";
import { PastrySection } from "@/components/PastrySection";
import { CartProvider, useCart } from "@/context/CartContext";
import type { Product } from "@/types/product";

const pastries: Product[] = [
  { id: 19, name: "Muffin de chocolate", price: 2500 },
  { id: 20, name: "Torta selva negra", price: 4200 },
];

function CartProbe(): JSX.Element {
  const { state, subtotal } = useCart();
  return (
    <div data-testid="cart-probe">
      {state.items.map((item) => (
        <span key={item.product.id}>
          {item.product.name}:{item.quantity}
        </span>
      ))}
      <span data-testid="subtotal">{subtotal}</span>
    </div>
  );
}

function renderWithCart(ui: ReactElement): RenderResult {
  return render(
    <CartProvider>
      {ui}
      <CartProbe />
    </CartProvider>,
  );
}

describe("PastrySection", () => {
  it("renders every pastry with its name and price", () => {
    renderWithCart(<PastrySection pastries={pastries} />);

    expect(screen.getByText("Muffin de chocolate")).toBeInTheDocument();
    expect(screen.getByText("Torta selva negra")).toBeInTheDocument();
  });

  it("dispatches ADD to the cart when a pastry's add button is clicked", async () => {
    const user = userEvent.setup();
    renderWithCart(<PastrySection pastries={pastries} />);

    await user.click(screen.getByRole("button", { name: /agregar muffin de chocolate/i }));

    expect(screen.getByText("Muffin de chocolate:1")).toBeInTheDocument();
  });

  it("increases the quantity when the same pastry is added again", async () => {
    const user = userEvent.setup();
    renderWithCart(<PastrySection pastries={pastries} />);

    const addMuffin = screen.getByRole("button", {
      name: /agregar muffin de chocolate/i,
    });
    await user.click(addMuffin);
    await user.click(addMuffin);

    expect(screen.getByText("Muffin de chocolate:2")).toBeInTheDocument();
  });

  it("keeps items independent from each other when adding different pastries", async () => {
    const user = userEvent.setup();
    renderWithCart(<PastrySection pastries={pastries} />);

    await user.click(screen.getByRole("button", { name: /agregar muffin de chocolate/i }));
    await user.click(screen.getByRole("button", { name: /agregar torta selva negra/i }));

    expect(screen.getByText("Muffin de chocolate:1")).toBeInTheDocument();
    expect(screen.getByText("Torta selva negra:1")).toBeInTheDocument();
  });

  it("updates the subtotal as pastries are added", async () => {
    const user = userEvent.setup();
    renderWithCart(<PastrySection pastries={pastries} />);

    await user.click(screen.getByRole("button", { name: /agregar muffin de chocolate/i }));

    expect(screen.getByTestId("subtotal")).toHaveTextContent("2500");
  });
});
