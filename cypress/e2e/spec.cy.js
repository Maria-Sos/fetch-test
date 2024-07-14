import {
  messageAlert,
  selectors,
  fillOutGridAndCheck,
  elIncludesGreaterOrLess,
} from "../../utils/helpers";

const nums = [0, 1, 2, 3, 4, 5, 6, 7, 8];
const midBar = 4;

async function findFakeBar(i, nums, midBar) {
  let foundFakeBar = false;
  const left = nums[i];
  const right = nums[nums.length - 1 - i];
  cy.get(selectors.leftGrid(i))
    .type(left)
    .get(selectors.rightGrid(i))
    .type(right)
    .get(selectors.weigh)
    .click()
    .get(selectors.list)
    .eq(i)
    .processElementText((text) => {
      if (text.includes("<") || text.includes(">")) {
        foundFakeBar = true;
        cy.setupAlertStub().then((alertStub) => {
          cy.get(
            selectors.coin(
              text.includes("<") ? left : nums.length - 1 - nums.indexOf(left)
            )
          ).click();
          cy.then(() => {
            cy.wrap(alertStub).should(
              "have.been.calledWith",
              messageAlert.success
            );
          });
          return;
        });
      } else if (text.includes("=") && !foundFakeBar) {
        findFakeBar(i + 1, nums, midBar);
      }
    });
}

describe("Find fake bar", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("Verify the fake bar is found and the correct success popup appears", () => {
    cy.get(selectors.resultBtn).should("have.text", "?");
    cy.get(selectors.coin(midBar)).click();
    cy.on("window:alert", (text) => {
      if (text.includes(messageAlert.success)) {
        fillOutGridAndCheck(
          selectors.leftGrid(nums[0]),
          selectors.rightGrid(nums[0]),
          midBar,
          nums[0]
        );
        elIncludesGreaterOrLess(selectors.list);
        elIncludesGreaterOrLess(selectors.resultBtn);
      } else if (text.includes(messageAlert.failed)) {
        findFakeBar(nums[0], nums, midBar);
      }
    });
  });

  it("Verify the Reset button empties the bowls", () => {
    cy.get(selectors.resultBtn).should("have.text", "?");
    fillOutGridAndCheck(
      selectors.leftGrid(nums[0]),
      selectors.rightGrid(nums[0]),
      midBar,
      nums[0]
    );
    cy.get(selectors.list).then(($el) => {
      cy.wrap($el).should("be.visible");
      const sign = $el.text().split(" ")[1];
      cy.get(selectors.resultBtn).should("have.text", sign);
    });
    cy.contains("button", "Reset").click();
    cy.get(selectors.resultBtn).should("have.text", "?");
    cy.get(selectors.leftGrid(nums[0])).should("be.empty");
    cy.get(selectors.rightGrid(nums[0])).should("be.empty");
  });

  it("Verify correct alert message when bowls have same number", () => {
    const sameNumber = 0;
    cy.get(selectors.leftGrid(nums[0])).type(sameNumber);
    cy.get(selectors.rightGrid(nums[0])).type(sameNumber);
    cy.setupAlertStub().then((alertStub) => {
      cy.get(selectors.weigh).click();
      cy.then(() => {
        cy.wrap(alertStub).should(
          "have.been.calledWith",
          messageAlert.theSameNumbers
        );
      });
    });
  });
});
