import React from 'react';
import styles from './view.module.css';

/**
 *
 * @param {*} children - JSX.Element
 * @param {*} padding  - Padding pattern: p-[sides]-[demention] e.g p-x-xl
 * @param {*} margin   - Margin pattern: m-[sides]-[demention] e.g p-x-xl
 * @param {*} rounded  - Radius pattern: p-[sides]-[demention] e.g p-x-xl
 * @param {*} border   -
 * @param {*} position -
 * @returns
 */
export const View = ({
  children,
  padding,
  margin,
  rounded,
  border,
  position,
  className,
  ...props
}) => {
  const paddingClass = padding ? styles[`p-${padding}`] : '';
  const marginClass = margin ? styles[`m-${margin}`] : '';
  const roundedClass = rounded ? styles[`rounded-${rounded}`] : '';
  const borderClass = border ? styles[`b-${border}`] : '';
  const positionClass = position ? styles[`position-${position}`] : '';

  return (
    <div
      className={`${paddingClass} ${marginClass} ${roundedClass} ${borderClass} ${positionClass} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default View;
