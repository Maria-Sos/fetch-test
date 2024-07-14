export const selectors = {
  leftGrid: (i) => `#left_${i}`,
  rightGrid: (i) => `#right_${i}`,
  weigh: "#weigh",
  coin: (i) => `#coin_${i}`,
  list: "ol > li",
  resultBtn: ".result > #reset",
};

export const messageAlert = {
  success: "Yay! You find it!",
  failed: "Oops! Try Again!",
  theSameNumbers: "Inputs are invalid: Both sides have coin(s): 0",
};

export const fillOutGridAndCheck = (left, right, numLeft, numRight) => {
  cy.get(left).type(numLeft);
  cy.get(right).type(numRight);
  cy.get(selectors.weigh).click();
};

export const elIncludesGreaterOrLess = (el) => {
  cy.get(el).then(($el) => {
    const text = $el.text();
    cy.wrap(text).then((txt) => {
      cy.wrap(txt.includes("<") || txt.includes(">")).should("be.true");
    });
  });
};
