import React, { useMemo } from 'react';
import { View, Text, StyleSheet,Image } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { COLORS } from '../theme/colors';
const MAIL_ICON = require('../../assets/icons/cart.png');

type Segment = { value: number; color?: string };

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function annulusSectorPath(
  cx: number,
  cy: number,
  rOut: number,
  rIn: number,
  startAng: number,
  endAng: number,
) {
  const p1 = polar(cx, cy, rOut, startAng);
  const p2 = polar(cx, cy, rOut, endAng);
  const p3 = polar(cx, cy, rIn, endAng);
  const p4 = polar(cx, cy, rIn, startAng);
  const sweep = endAng - startAng;
  const large = Math.abs(sweep) > 180 ? 1 : 0;
  const sweepFlag = sweep >= 0 ? 1 : 0;
  return `M ${p1.x} ${p1.y} A ${rOut} ${rOut} 0 ${large} ${sweepFlag} ${p2.x} ${p2.y} L ${p3.x} ${p3.y} A ${rIn} ${rIn} 0 ${large} ${sweepFlag ? 0 : 1} ${p4.x} ${p4.y} Z`;
}

type Props = {
  segments: Segment[];
  size?: number;
  stroke?: number;
  centerLabel: string;
  centerSub?: string;
};

export default function DonutChart({
  segments,
  size = 200,
  stroke = 36,
  centerLabel,
  centerSub = 'Total Sales',
}: Props) {
  const paths = useMemo(() => {
    const raw = segments.map((s) => Math.max(0, s.value));
    const total = raw.reduce((a, b) => a + b, 0) || 1;
    const cx = size / 2;
    const cy = size / 2;
    const rOut = size / 2 - 4;
    const rIn = rOut - stroke;
    let start = -90;
    const items: { d: string; color: string }[] = [];
    raw.forEach((v, i) => {
      const sweep = (v / total) * 360;
      if (sweep <= 0.05) return;
      const end = start + sweep;
      const palette = COLORS.chartPalette;
      const color = segments[i].color ?? palette[i % palette.length];
      items.push({
        d: annulusSectorPath(cx, cy, rOut, rIn, start, end),
        color,
      });
      start = end;
    });
    return items;
  }, [segments, size, stroke]);

  return (
    <View style={styles.wrap}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths.map((p, i) => (
          <Path key={i} d={p.d} fill={p.color} />
        ))}
      </Svg>
      <View style={[styles.center, { width: size - stroke * 2, height: size - stroke * 2 }]}>
      <Image source={MAIL_ICON} style={styles.iconImage} />

        <Text style={styles.centerLabel} numberOfLines={1} adjustsFontSizeToFit>
          {centerLabel}
        </Text>
        <Text style={styles.centerSub}>{centerSub}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  centerSub: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  iconImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  }
});
