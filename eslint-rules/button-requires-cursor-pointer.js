export default {
  meta: {
    type: "suggestion",
    fixable: "code",
    schema: [],
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.name !== "button") return;

        const classAttr = node.attributes.find(
          (attr) =>
            attr.type === "JSXAttribute" &&
            attr.name.name === "className"
        );

        if (!classAttr?.value) return;

        let value = "";
        let isFixable = false;

        if (classAttr.value.type === "Literal") {
          value = classAttr.value.value;
          isFixable = true;
        } else if (classAttr.value.type === "JSXExpressionContainer" && classAttr.value.expression.type === "TemplateLiteral") {
          // Simplistic check for template literals: just check if 'cursor-pointer' is anywhere in the quasis
          const templateLiteral = classAttr.value.expression;
          const fullString = templateLiteral.quasis.map(q => q.value.raw).join('');
          if (fullString.includes("cursor-pointer")) return;
          
          context.report({
            node: classAttr,
            message: 'button must include "cursor-pointer" in className',
            // Auto-fix for template literals is complex, so we skip it here for simplicity or implement carefully
          });
          return;
        } else {
          return;
        }

        if (typeof value !== "string") return;
        if (value.includes("cursor-pointer")) return;

        context.report({
          node: classAttr,
          message: 'button must include "cursor-pointer" in className',
          fix(fixer) {
            if (isFixable) {
              return fixer.replaceText(
                classAttr.value,
                `"${value} cursor-pointer"`
              );
            }
          },
        });
      },
    };
  },
};