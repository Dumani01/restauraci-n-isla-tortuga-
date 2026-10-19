import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import "../../i18n/index.js";
import { AuthProvider } from "../../components/auth/AuthProvider.jsx";
import { ThemeProvider } from "../../components/theme/ThemeProvider.jsx";
import { CoreDashboard } from "./CoreDashboard.jsx";
import { PrivateLayout } from "../../components/layout/PrivateLayout.jsx";
import { registerObservationRecord } from "../../services/databaseService.js";

function renderDashboard(role) {
  const users = {
    ADMIN: ["demo-admin", "admin@restauracioncoralina.demo"],
    MODERATOR: ["demo-moderator", "coordinacion@restauracioncoralina.demo"],
    USER: ["demo-user", "visitante@restauracioncoralina.demo"],
  };
  const [id, email] = users[role];
  localStorage.setItem(
    "rc_user",
    JSON.stringify({
      id,
      email,
      name: "Usuario demo",
      role,
      profile: role,
      demo: true,
    }),
  );
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route element={<PrivateLayout />}>
              <Route path="/" element={<CoreDashboard />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </MemoryRouter>,
  );
}

describe("CoreDashboard", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.removeItem("rc_registered_users");
  });

  test("muestra el panel de administración y el acceso al registro para ADMIN", () => {
    renderDashboard("ADMIN");

    expect(
      screen.getByRole("heading", { name: /panel de administraci/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registrar usuario/i }),
    ).toHaveAttribute("href", "/admin/usuarios");
  });

  test("actualiza el indicador de observaciones desde los registros persistidos", () => {
    registerObservationRecord({
      date: "2026-10-08",
      activity: "monitoring",
      responsible: "Equipo",
      fragment: "F-1",
      notes: "",
    });
    renderDashboard("ADMIN");

    const observationWidget = screen
      .getAllByText("Observaciones")
      .map((element) => element.closest(".core-widget"))
      .find(Boolean);
    expect(observationWidget.querySelector("strong")).toHaveTextContent("1");
  });

  test("muestra el panel de coordinación sin acceso de administrador para MODERATOR", () => {
    renderDashboard("MODERATOR");

    expect(
      screen.getByRole("heading", { name: /panel de coordinaci/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /registro de trabajo/i }),
    ).toHaveAttribute("href", "/observaciones");
    expect(
      screen.queryByRole("link", { name: /registrar usuario/i }),
    ).not.toBeInTheDocument();
  });

  test("muestra el panel de colaborador para USER", () => {
    renderDashboard("USER");

    expect(
      screen.getByRole("heading", { name: /panel de colaborador/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /explorar el proyecto/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /mapa|galer[ií]a|proyecto/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /registrar usuario/i }),
    ).not.toBeInTheDocument();
  });

  test("muestra el boton de salida al inicio de la barra lateral", () => {
    renderDashboard("USER");
    const logout = screen.getByRole("button", { name: /salir/i });
    const brand = screen.getByRole("link", { name: /mostrar u ocultar menú/i });

    expect(
      brand.compareDocumentPosition(logout) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
    expect(logout).toHaveClass("private-logout");
  });

  test("mantiene navegación y controles utilizables con el sidebar contraído a iconos", () => {
    const { container } = renderDashboard("USER");
    fireEvent.click(
      screen.getByRole("link", { name: /mostrar u ocultar menú/i }),
    );

    expect(container.querySelector(".private")).toHaveClass(
      "private--collapsed",
    );
    expect(
      screen.getByRole("link", { name: "Observaciones" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /ajustes de texto/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /salir/i })).toHaveClass(
      "private-logout",
    );
  });
});
