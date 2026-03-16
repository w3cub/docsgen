export default function transformer(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);

  /*
  1 删除 const Cls = (app.Router = class Router {})
  */
  root.find(j.VariableDeclaration).forEach(path => {
    const decl = path.node.declarations[0];
    if (
      decl.init &&
      decl.init.type === "AssignmentExpression" &&
      decl.init.right.type === "ClassExpression"
    ) {
      j(path).replaceWith(
        j.expressionStatement(decl.init)
      );
    }
  });

  /*
  2 initClass → static field
  */
  root.find(j.MethodDefinition, {
    key: { name: "initClass" }
  }).forEach(path => {
    const body = path.node.value.body.body;

    body.forEach(stmt => {
      if (
        stmt.type === "ExpressionStatement" &&
        stmt.expression.type === "AssignmentExpression"
      ) {
        const assign = stmt.expression;

        if (
          assign.left.type === "MemberExpression" &&
          assign.left.object.type === "ThisExpression"
        ) {
          const name = assign.left.property.name;

          const classProp = j.classProperty(
            j.identifier(name),
            assign.right
          );

          j(path).insertBefore(classProp);
        }
      }
    });

    j(path).remove();
  });

  /*
  3 删除 Router.initClass()
  */
  root.find(j.CallExpression, {
    callee: {
      property: { name: "initClass" }
    }
  }).remove();

  /*
  4 $.extend(this.prototype, Events) → extends Events
  */
  root.find(j.CallExpression, {
    callee: {
      object: { name: "$" },
      property: { name: "extend" }
    }
  }).forEach(path => {
    const args = path.node.arguments;

    if (
      args[0].type === "MemberExpression" &&
      args[0].property.name === "prototype"
    ) {
      const className = args[0].object.name;
      const parent = args[1].name;

      root.find(j.ClassExpression, {
        id: { name: className }
      }).forEach(cls => {
        cls.node.superClass = j.identifier(parent);
      });

      j(path).remove();
    }
  });

  /*
5 __guard__ → optional chaining
*/

root.find(j.CallExpression, {
  callee: { name: "__guard__" }
}).forEach(path => {
  const [obj, arrow] = path.node.arguments;

  if (arrow && arrow.type === "ArrowFunctionExpression") {
    const body = arrow.body;

    if (body.type === "MemberExpression") {
      const propChain = [];

      let current = body;

      while (current.type === "MemberExpression") {
        propChain.unshift(current.property);
        current = current.object;
      }

      let newExpr = obj;

      propChain.forEach(prop => {
        newExpr = j.optionalMemberExpression(
          newExpr,
          prop,
          false,
          true
        );
      });

      j(path).replaceWith(newExpr);
    }
  }
});

  return root.toSource();
}