import React, { useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, ActivityIndicator, Alert, Image } from "react-native";
import DotGridSelector from "../components/DotGridSelector";
import { generateKolam } from "../utils/api";

export default function KolamGeneratorScreen() {
  const [gridSize, setGridSize] = useState("1-19-1");
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);
  const [resp, setResp] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setImgUrl(null);
    setResp(null);
    try {
      const data = await generateKolam(gridSize, "traditional");
      console.log("generate response object:", data);
      setResp(data);

      const url = data?.url || data?.secure_url || data?.secureUrl || data?.data?.url;
      console.log("resolved image url:", url);
      if (!url) {
        Alert.alert("No URL", "Backend did not return an image URL. Check console.");
        setLoading(false);
        return;
      }

      // prefetch to verify reachable
      const ok = await Image.prefetch(url).catch(e => {
        console.warn("prefetch failed", e);
        return false;
      });

      if (!ok) {
        // try a simple fetch to get status
        try {
          const r = await fetch(url);
          console.log("image fetch status:", r.status, r.headers.get("content-type"));
          if (!r.ok) throw new Error("image fetch not ok");
        } catch (err) {
          Alert.alert("Image not reachable", "Device cannot fetch the image URL. Check network.");
          setLoading(false);
          return;
        }
      }

      setImgUrl(url);
    } catch (e) {
      console.error("generate error", e);
      Alert.alert("Error", e.message || "Failed to generate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kolam Generator</Text>
      <DotGridSelector value={gridSize} onChange={setGridSize} />
      <Button title="Generate" onPress={handleGenerate} />
      {loading && <ActivityIndicator style={{ margin: 24 }} />}
      {resp && <Text style={{ fontSize: 12, marginTop: 8 }}>{JSON.stringify(resp)}</Text>}
      {imgUrl && (
        <View style={styles.canvasContainer}>
          <Image source={{ uri: imgUrl }} style={styles.previewImage} resizeMode="contain" />
          <Text selectable style={{ marginTop: 8 }}>{imgUrl}</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 24, alignItems: "center" },
  title: { fontSize: 22, marginBottom: 16 },
  canvasContainer: { marginTop: 24, width: "100%", alignItems: "center" },
  previewImage: { width: 300, height: 300, backgroundColor: "#fff" },
});
