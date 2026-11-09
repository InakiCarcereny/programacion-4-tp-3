import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { CoffeeSection } from "@/components/CoffeeSection";
import { CartProvider, useCart } from "@/context/CartContext";
import { productosFixture } from "@/mocks/fixtures";

function CartProbe(): JSX.Element {
  const { state, subtotal } = useCart();

  return (
    <div>
      {state.items.map((item) => (
        <span key={item.product.id}>
          {item.product.name}:{item.quantity}
        </span>
      ))}
      <span data-testid="subtotal">{subtotal}</span>
    </div>
  );
}

function renderCoffeeSection(): void {
  render(
    <CartProvider>
      <CoffeeSection productos={productosFixture} />
      <CartProbe />
    </CartProvider>,
  );
}

function getGroup(name: RegExp): HTMLElement {
  return screen.getByRole("group", { name });
}

describe("CoffeeSection", () => {
  it("renders the three selection steps", () => {
    renderCoffeeSection();

    expect(screen.getByRole("heading", { name: "Café" })).toBeInTheDocument();

    const drinks = getGroup(/bebida/i);
    expect(within(drinks).getByRole("button", { name: "Expreso" })).toBeInTheDocument();
    expect(within(drinks).getByRole("button", { name: "Filtrado" })).toBeInTheDocument();

    const sizes = getGroup(/tamaño/i);
    expect(within(sizes).getByRole("button", { name: "Pocillo" })).toBeInTheDocument();
    expect(within(sizes).getByRole("button", { name: "Mediano" })).toBeInTheDocument();
    expect(within(sizes).getByRole("button", { name: "Taza grande" })).toBeInTheDocument();

    const origins = getGroup(/origen/i);
    expect(within(origins).getByRole("button", { name: /Brasil/i })).toBeInTheDocument();
    expect(within(origins).getByRole("button", { name: /Colombia/i })).toBeInTheDocument();
    expect(within(origins).getByRole("button", { name: /Etiopia/i })).toBeInTheDocument();
  });

  it("disables the add button until drink, size and origin are selected", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    const addButton = screen.getByRole("button", {
      name: /elegí bebida, tamaño y origen/i,
    });
    expect(addButton).toBeDisabled();

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Expreso" }));
    expect(addButton).toBeDisabled();

    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Mediano" }));
    expect(addButton).toBeDisabled();

    await user.click(within(getGroup(/origen/i)).getByRole("button", { name: /Colombia/i }));
    expect(screen.getByRole("button", { name: /agregar al pedido/i })).toBeEnabled();
  });

  it("shows the api price for every origin once drink and size are selected", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    const origins = getGroup(/origen/i);
    expect(within(origins).getAllByText("—")).toHaveLength(3);

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Expreso" }));
    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Mediano" }));

    expect(within(origins).getByText("$6.280")).toBeInTheDocument();
    expect(within(origins).getByText("$7.360")).toBeInTheDocument();
    expect(within(origins).getByText("$8.980")).toBeInTheDocument();
  });

  it("updates origin prices when the drink type changes", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Expreso" }));
    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Mediano" }));

    const origins = getGroup(/origen/i);
    expect(within(origins).getByText("$7.360")).toBeInTheDocument();

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Filtrado" }));

    expect(within(origins).getByText("$5.300")).toBeInTheDocument();
    expect(within(origins).getByText("$5.900")).toBeInTheDocument();
    expect(within(origins).getByText("$6.800")).toBeInTheDocument();
  });

  it("updates origin prices when the size changes", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Expreso" }));
    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Pocillo" }));

    const origins = getGroup(/origen/i);
    expect(within(origins).getByText("$5.020")).toBeInTheDocument();

    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Taza grande" }));

    expect(within(origins).getByText("$7.540")).toBeInTheDocument();
    expect(within(origins).getByText("$8.980")).toBeInTheDocument();
    expect(within(origins).getByText("$11.140")).toBeInTheDocument();
  });

  it("marks the selected options with aria-pressed", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    const drinks = getGroup(/bebida/i);
    const sizes = getGroup(/tamaño/i);
    const origins = getGroup(/origen/i);

    await user.click(within(drinks).getByRole("button", { name: "Filtrado" }));
    await user.click(within(sizes).getByRole("button", { name: "Taza grande" }));
    await user.click(within(origins).getByRole("button", { name: /Etiopia/i }));

    expect(within(drinks).getByRole("button", { name: "Filtrado" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(drinks).getByRole("button", { name: "Expreso" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
    expect(within(sizes).getByRole("button", { name: "Taza grande" })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(within(origins).getByRole("button", { name: /Etiopia/i })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("adds the matching coffee to the cart with the api price", async () => {
    const user = userEvent.setup();
    renderCoffeeSection();

    await user.click(within(getGroup(/bebida/i)).getByRole("button", { name: "Expreso" }));
    await user.click(within(getGroup(/tamaño/i)).getByRole("button", { name: "Mediano" }));
    await user.click(within(getGroup(/origen/i)).getByRole("button", { name: /Colombia/i }));
    await user.click(screen.getByRole("button", { name: /agregar al pedido/i }));

    expect(screen.getByText("Expreso Mediano Colombia:1")).toBeInTheDocument();
    expect(screen.getByTestId("subtotal")).toHaveTextContent("7360");
  });
});
