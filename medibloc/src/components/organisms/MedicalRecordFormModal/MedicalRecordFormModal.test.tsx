// @vitest-environment jsdom
import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MedicalRecordFormModal } from "./MedicalRecordFormModal";
import type { Patient } from "../../../types";

const mockPatients: Patient[] = [
  {
    id: 1,
    userId: 1,
    user: {
      id: 1,
      email: "patient1@test.com",
      firstName: "Jean",
      lastName: "Dupont",
      role: "PATIENT",
      createdAt: "2026-06-17",
      updatedAt: "2026-06-17"
    }
  },
  {
    id: 2,
    userId: 2,
    user: {
      id: 2,
      email: "patient2@test.com",
      firstName: "Alice",
      lastName: "Martin",
      role: "PATIENT",
      createdAt: "2026-06-17",
      updatedAt: "2026-06-17"
    }
  }
];

describe("MedicalRecordFormModal", () => {
  test("renders creation form with default values", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(
      <MedicalRecordFormModal
        record={null}
        patients={mockPatients}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    expect(screen.getByText("Créer un Dossier Médical")).toBeDefined();
    expect(screen.getByLabelText("Sélectionner le Patient")).toBeDefined();
    expect(screen.getByLabelText("Titre de l'Observation")).toBeDefined();
    expect(screen.getByLabelText("Observations cliniques & Diagnostics")).toBeDefined();
    expect(screen.getByRole("button", { name: "Créer le dossier" })).toBeDefined();
  });

  test("submits form correctly with input values", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(
      <MedicalRecordFormModal
        record={null}
        patients={mockPatients}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={false}
      />
    );

    fireEvent.change(screen.getByLabelText("Titre de l'Observation"), {
      target: { value: "Nouvelle Consultation" }
    });
    fireEvent.change(screen.getByLabelText("Observations cliniques & Diagnostics"), {
      target: { value: "Le patient va mieux." }
    });
    fireEvent.change(screen.getByLabelText("Documents et Pièces jointes (URLs séparées par des virgules)"), {
      target: { value: "file1.pdf, file2.png" }
    });

    fireEvent.click(screen.getByRole("button", { name: "Créer le dossier" }));

    expect(onSubmit).toHaveBeenCalledWith({
      patientId: 1,
      title: "Nouvelle Consultation",
      content: "Le patient va mieux.",
      files: ["file1.pdf", "file2.png"]
    });
  });

  test("disables inputs or submit button when loading is true", () => {
    const onClose = vi.fn();
    const onSubmit = vi.fn();
    render(
      <MedicalRecordFormModal
        record={null}
        patients={mockPatients}
        onClose={onClose}
        onSubmit={onSubmit}
        loading={true}
      />
    );

    const submitBtn = screen.getByRole("button", { name: "Enregistrement..." }) as HTMLButtonElement;
    expect(submitBtn.disabled).toBe(true);
  });
});
