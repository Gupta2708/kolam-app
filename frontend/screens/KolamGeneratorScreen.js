import React, { useState } from "react";
import { 
  View, 
  Text, 
  Button, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Alert, 
  Image 
} from "react-native";
import DotGridSelector from "../components/DotGridSelector";
import { generateKolam } from "../utils/api";

export default function KolamGeneratorScreen() {
  const [gridSize, setGridSize] = useState("1-19-1");
  const [loading, setLoading] = useState(false);
  const [imgUrl, setImgUrl] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    setImgUrl(null);

    try {
      const data = await generateKolam(gridSize, "traditional");
      console.log("Kolam API response:", data);

      // Try to resolve URL from possible fields
      const url = 
        data?.url || 
        data?.secure_url || 
        data?.secureUrl || 
        data?.data?.url;

      console.log("Resolved image URL:", url);

      if (!url) {
        Alert.alert("No URL", "Backend did not return an image URL. Check console.");
        setLoading(false);
        return;
      }

      // Prefetch to confirm image accessibility
      const ok = await Image.prefetch(url).catch(e => {
        console.warn("Prefetch failed", e);
        return false;
      });

      if (!ok) {
        try {
          const r = await fetch(url);
          console.log("Image fetch status:", r.status, r.headers.get("content-type"));
          if (!r.ok) throw new Error("Image fetch not ok");
        } catch (err) {
          Alert.alert("Image not reachable", "Device cannot fetch the image URL. Check network.");
          setLoading(false);
          return;
        }
      }

      setImgUrl(url);
    } catch (e) {
      console.error("Generate error:", e);
      Alert.alert("Error", e.message || "Failed to generate kolam");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Kolam Generator</Text>

      {/* Grid Selector */}
      <DotGridSelector value={gridSize} onChange={setGridSize} />

      {/* Generate Button */}
      <Button title="Generate" onPress={handleGenerate} />

      {/* Loader */}
      {loading && <ActivityIndicator style={{ margin: 24 }} size="large" />}

      {/* Result */}
      {imgUrl && (
        <View style={styles.resultContainer}>
          <Image 
            source={{ uri: imgUrl }} 
            style={styles.kolamImage} 
            resizeMode="contain"
          />
          <Text style={styles.successText}>✨ Kolam generated successfully!</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 24, 
    alignItems: "center", 
    backgroundColor: "#fafafa", 
    flexGrow: 1 
  },
  title: { 
    fontSize: 22, 
    marginBottom: 16, 
    fontWeight: "bold", 
    color: "#333" 
  },
  resultContainer: {
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  kolamImage: {
    width: 300,
    height: 300,
    marginVertical: 15,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 3, // subtle shadow for Android
  },
  successText: {
    color: 'green',
    fontSize: 16,
    marginTop: 10,
    fontWeight: "500",
  }
});
