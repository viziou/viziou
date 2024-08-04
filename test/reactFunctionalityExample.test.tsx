import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { assert, expect } from "chai";
import List from "./List.tsx";

describe("List Functionality Test", async () => {
    it("should increment when clicked", async () => {
        const {container} = render(<List></List>);
        const button = await screen.findByText("Add");
        assert.equal(container.getElementsByTagName("li").length, 0);

        fireEvent.click(button);
        assert.equal(container.querySelectorAll("li").length, 1);

        fireEvent.click(button); // click twice
        fireEvent.click(button);

        expect((await screen.findAllByText("child")).length).to.be.equal(3);
    });
});