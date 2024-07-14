Cypress.Commands.add(
  "processElementText",
  { prevSubject: true },
  (subject, callback) => {
    cy.wrap(subject)
      .invoke("text")
      .then((text) => {
        callback(text);
      });
  }
);

Cypress.Commands.add("setupAlertStub", () => {
  const stub = cy.stub();
  cy.on("window:alert", stub);
  return stub;
});

Cypress.Commands.add("elIncludesText", (el, text) => {
  cy.get(el).then(($el) => {
    const text = $el.text();
    cy.wrap(text).then((txt) => {
      cy.wrap(txt.includes("<") || txt.includes(">")).should("be.true");
    });
  });
});
