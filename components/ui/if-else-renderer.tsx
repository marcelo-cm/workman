import React, { ReactNode } from 'react';

/**
 * EXPERIMENTAL, DOESN'T WORK AS EXPECTED
 * Evaluate a ternary expression and render the appropriate component
 */
const IfElseRender = ({
  ternary,
  ifTrue,
  ifFalse,
}: {
  ternary: boolean;
  ifTrue?: ReactNode | null;
  ifFalse?: ReactNode | null;
}) => {
  return <>{!!ternary ? ifTrue : ifFalse} </>;
};

export default IfElseRender;
