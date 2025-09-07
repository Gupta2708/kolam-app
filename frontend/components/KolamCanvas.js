import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

const { width } = Dimensions.get('window');
const CANVAS_SIZE = width * 0.9;

export default function KolamCanvas({ dots = [], strokes = [], animate = false }) {
  const [drawnPoints, setDrawnPoints] = useState([]);
  const timer = useRef(null);

  useEffect(() => {
    if (animate && strokes.length > 0) {
      setDrawnPoints([]);
      let i = 0;
      timer.current = setInterval(() => {
        i += 5; // Draw 5 points per tick
        setDrawnPoints(strokes[0].slice(0, i));
        if (i >= strokes[0].length) clearInterval(timer.current);
      }, 16);
      return () => clearInterval(timer.current);
    } else if (strokes.length > 0) {
      setDrawnPoints(strokes[0]);
    }
  }, [strokes, animate]);

  // Normalize coordinates to fit canvas
  const allX = dots.map(([x]) => x).concat(strokes[0]?.map(([x]) => x) || []);
  const allY = dots.map(([,y]) => y).concat(strokes[0]?.map(([,y]) => y) || []);
  const minX = Math.min(...allX, 0), maxX = Math.max(...allX, 1);
  const minY = Math.min(...allY, 0), maxY = Math.max(...allY, 1);
  const scale = Math.min(CANVAS_SIZE / (maxX - minX + 2), CANVAS_SIZE / (maxY - minY + 2));
  const offsetX = (CANVAS_SIZE - scale * (maxX - minX)) / 2;
  const offsetY = (CANVAS_SIZE - scale * (maxY - minY)) / 2;

  const tx = x => offsetX + scale * (x - minX);
  const ty = y => offsetY + scale * (y - minY);

  return (
    <View style={styles.container}>
      <Svg width={CANVAS_SIZE} height={CANVAS_SIZE}>
        {dots.map(([x, y], i) => (
          <Circle key={i} cx={tx(x)} cy={ty(y)} r={4} fill="#333" />
        ))}
        {drawnPoints.length > 1 && (
          <Polyline
            points={drawnPoints.map(([x, y]) => `${tx(x)},${ty(y)}`).join(' ')}
            fill="none"
            stroke="#d81b60"
            strokeWidth={3}
          />
        )}
      </Svg>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center' },
});
