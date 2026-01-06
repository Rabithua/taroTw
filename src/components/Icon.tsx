// https://gist.github.com/djyde/5ba1aa91eea13afcb4930f82dd263a3d

import { IconNode } from "lucide";
import { Image } from "@tarojs/components";
import React from "react";

const b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function btoa(string: string) {
  string = String(string);
  let bitmap: number,
    a: number,
    b: number,
    c: number,
    result = "",
    i = 0,
    rest = string.length % 3; // To determine the final padding

  for (; i < string.length; ) {
    if (
      (a = string.charCodeAt(i++)) > 255 ||
      (b = string.charCodeAt(i++)) > 255 ||
      (c = string.charCodeAt(i++)) > 255
    )
      throw new TypeError(
        "Failed to execute 'btoa' on 'Window': The string to be encoded contains characters outside of the Latin1 range."
      );

    bitmap = (a << 16) | (b << 8) | c;
    result +=
      b64.charAt((bitmap >> 18) & 63) +
      b64.charAt((bitmap >> 12) & 63) +
      b64.charAt((bitmap >> 6) & 63) +
      b64.charAt(bitmap & 63);
  }

  // If there's need of padding, replace the last 'A's with equal signs
  return rest ? result.slice(0, rest - 3) + "===".substring(rest) : result;
}

function svgPropToBase64(
  iconNode: IconNode,
  options: {
    width?: number;
    height?: number;
    color?: string;
    strokeWidth?: number;
  }
) {
  const {
    width = 24,
    height = 24,
    color = "currentColor",
    strokeWidth = 2,
  } = options;

  // Convert SVG icon node to SVG string
  const svgString = iconNode
    .map(([tag, attrs]) => {
      const attrsString = Object.entries(attrs)
        .map(([key, value]) => `${key}="${value}"`)
        .join(" ");
      return `<${tag} ${attrsString}/>`;
    })
    .join("");

  // Wrap in SVG root element with proper attributes
  const fullSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${svgString}</svg>`;

  // Convert to base64
  const base64 = btoa(fullSvg);

  return `data:image/svg+xml;base64,${base64}`;
}

export const Icon = React.memo(
  (props: {
    icon: IconNode;
    size?: number;
    color?: string;
    strokeWidth?: number;
  }) => {
    const { size = 24, color = "currentColor", strokeWidth = 1 } = props;
    // Convert rpx to px for SVG (rpx / 2 = px on most devices)
    const pxSize = size / 2;
    return (
      <Image
        style={{
          width: `${size}rpx`,
          height: `${size}rpx`,
        }}
        src={svgPropToBase64(props.icon, {
          width: pxSize,
          height: pxSize,
          color: color,
          strokeWidth: strokeWidth,
        })}
      />
    );
  }
);
