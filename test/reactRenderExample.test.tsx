import React from "react";
import { render, screen } from "@testing-library/react";
import { expect } from "chai";

describe("Save Button Test", () => {
    it("is rendering", () => {
        render(<button>Save</button>);

        const button = screen.getByText("Save");
        expect(button).to.be.not.null;

        const buttonDom = screen.getByRole("button");
        expect(buttonDom).to.be.not.null;
    });
})

