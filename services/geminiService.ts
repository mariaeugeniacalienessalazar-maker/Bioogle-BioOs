
import { GoogleGenAI, Type } from "@google/genai";
import { MicroorganismData, SpotlightData, SystemUpdate } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Main search function specialized for Biogle
 */
export const fetchMicroorganismData = async (term: string): Promise<MicroorganismData> => {
  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      Actúa como "Biogle", la enciclopedia biológica definitiva.
      Analiza el término: "${term}".
      
      Objetivo: Devolver información MASIVA y detallada.
      
      Instrucciones:
      1. Si es una entidad biológica, 'responseType': 'ENTITY'.
      2. 'taxonomy': Clasificación científica completa.
      3. 'hazardLevel': Nivel de bioseguridad (Safe, Low, Moderate, High, Extreme).
      4. 'funFacts': 3 datos curiosos raros.
      5. 'habitatTemp': Temperatura ideal.
      
      Genera 4 'webResults' simulados de papers científicos.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            isValid: { type: Type.BOOLEAN },
            responseType: { type: Type.STRING, enum: ["ENTITY", "QA", "INVALID"] },
            scientificName: { type: Type.STRING },
            commonName: { type: Type.STRING },
            type: { type: Type.STRING },
            description: { type: Type.STRING },
            habitatTemp: { type: Type.STRING },
            taxonomy: {
              type: Type.OBJECT,
              properties: {
                kingdom: { type: Type.STRING },
                phylum: { type: Type.STRING },
                class: { type: Type.STRING },
                order: { type: Type.STRING },
                family: { type: Type.STRING },
                genus: { type: Type.STRING },
              }
            },
            hazardLevel: { type: Type.STRING, enum: ["Safe", "Low", "Moderate", "High", "Extreme"] },
            funFacts: { type: Type.ARRAY, items: { type: Type.STRING } },
            characteristics: { type: Type.ARRAY, items: { type: Type.STRING } },
            webResults: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  url: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                  source: { type: Type.STRING }
                }
              }
            },
            bioAnswer: { type: Type.STRING },
          }
        }
      }
    });
    if (!response.text) throw new Error("No response");
    
    // Add fake file metadata for BioDrive
    const data = JSON.parse(response.text) as MicroorganismData;
    data.fileSize = `${(Math.random() * 50 + 10).toFixed(1)} MB`;
    data.lastModified = new Date().toLocaleDateString();
    
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error("Error en la red neuronal de Bio.");
  }
};

export const getMicrobeForTemperature = async (temp: number): Promise<{name: string, desc: string}> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `La temperatura ambiente actual es de ${temp}°C. Nombra UN SOLO microorganismo (bacteria, hongo, arquea) que prospere o sea común a esta temperatura exacta.
      Responde en JSON: { "name": "Nombre Científico", "desc": "Breve razón en 5 palabras" }`,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { name: "Microbiota Local", desc: "Analizando entorno..." };
  }
};

export const chatWithBio = async (message: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Eres "Bio", un asistente de IA experto en biología dentro de la app "Biogle".
        Contexto actual de búsqueda del usuario (si existe): "${context}".
        Usuario dice: "${message}".
        Responde de forma amigable, científica y breve (máximo 50 palabras). Usa emojis.
      `
    });
    return response.text || "Estoy procesando tus datos biológicos...";
  } catch (e) {
    return "Error de conexión neuronal.";
  }
};

export const generateFastMicroscopeImage = async (term: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [{ text: `Scientific SEM (Scanning Electron Microscope) image of ${term}, hyper detailed, false color green and blue, biological textbook style.` }]
      }
    });
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) return `data:image/jpeg;base64,${part.inlineData.data}`;
    }
    return "";
  } catch (e) { return ""; }
};

export const fetchSimulatedPageContent = async (title: string, query: string): Promise<string> => {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: `
      Genera el contenido HTML (solo el body, usando clases de Tailwind CSS) para un artículo científico web titulado "${title}".
      El tema es: "${query}".
      Estilo académico pero accesible.
    `
  });
  return response.text || "<p>Error generando la página.</p>";
};

export const getWeeklySpotlight = async (): Promise<SpotlightData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `
        Genera un "Descubrimiento de la Semana" para la portada de una app de biología.
        Debe ser un tema científico fascinante, raro o futurista (ej. CRISPR, Bacterias come-plástico, Tardígrados en la luna).
        
        JSON esperado: {
          "title": "Titulo Impactante (3-5 palabras)",
          "subtitle": "Subtítulo explicativo breve",
          "content": "Resumen fascinante en 2 frases",
          "tag": "Categoría (ej. Genética, Astrobiología)"
        }
      `,
      config: { responseMimeType: "application/json" }
    });
    return JSON.parse(response.text || '{}');
  } catch (e) {
    return { title: "Cargando Novedades...", subtitle: "", content: "", tag: "BioOS" };
  }
};

export const generateDailyChangelog = async (): Promise<SystemUpdate> => {
    const dateStr = new Date().toLocaleDateString('es-ES').replace(/\//g, '.');
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: `Genera 3 "notas de parche" cortas y técnicas pero ficticias para una actualización de software biológico llamado "BioOS". 
            Ejemplos: "Optimización de renderizado mitocondrial", "Nueva base de datos de extremófilos", "Calibración de sensores de pH".
            Responde JSON: { "features": ["nota1", "nota2", "nota3"] }`,
            config: { responseMimeType: "application/json" }
        });
        const data = JSON.parse(response.text || '{"features": []}');
        return {
            version: `v${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`,
            date: dateStr,
            features: data.features.length > 0 ? data.features : ["Mejoras de rendimiento celular", "Actualización de catálogo viral", "Parche de seguridad de ADN"]
        };
    } catch {
        return {
            version: `v${new Date().getFullYear()}.${new Date().getMonth() + 1}.${new Date().getDate()}`,
            date: dateStr,
            features: ["Sincronización de núcleos", "Optimización de base de datos", "Mejoras generales"]
        };
    }
};