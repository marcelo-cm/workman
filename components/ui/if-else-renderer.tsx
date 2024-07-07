import React, { ReactNode } from 'react';

/**
 * EXPERIMENTAL, DOESN'T WORK AS EXPECTED
 * Evaluate a condition expression and render the appropriate component
 */
const IfElseRender = ({
  condition,
  ifTrue,
  ifFalse,
}: {
  condition: boolean;
  ifTrue?: ReactNode | null;
  ifFalse?: ReactNode | null;
}) => {
  return <>{!!condition ? ifTrue : ifFalse} </>;
};

export default IfElseRender;
