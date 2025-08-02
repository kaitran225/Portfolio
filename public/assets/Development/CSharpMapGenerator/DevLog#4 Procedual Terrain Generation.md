# DevLog#4 Procedual Terrain Generation

Tags: Stable
Date: March 20, 2023
Person: Nguyên Khánh Trần

### Map Generator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapGenerator : MonoBehaviour
{
    public enum DrawMode { NoiseMap, ColorMap, FallOffMap, TemperatureMap }
    public DrawMode drawMode;
    public int size;
    public float noiseScale;
    [Range(0, 15)]
    public int octaves;
    [Range(0, 1)]
    public float persistance;
    public float lacunarity;

    public Gradient gradient;

    public bool autoUpdate;
    public bool useFallOff;

    float[,] fallOffMap;

    public Vector2 offset;
    public int seed;
    public TerrainType[] regoins;
    public List<SavedTerrain> savedTerrain;
    private Color[] colorMap;

    private int height;
    private int width;
    private void Awake()
    {
        fallOffMap = FallOffMap.GenerateFallOffMap(width, height);
    }

    public void autoSaved()
    {
        SavedTerrain saved = new SavedTerrain();
        saved.Height = height;
        saved.Width = width;

        saved.Scale = noiseScale;
        saved.Seed = seed;
        saved.Offset = offset;
        
        saved.Persitance = persistance;
        saved.Octaves = octaves;
        saved.Lacunarity = lacunarity;

        saved.Gradient = gradient;

        saved.Texture = TextureGenerator.TextureFromColorMap(colorMap,width,height);

        savedTerrain.Add(saved);
    }
    public void randomSeed()
    {
        seed = Random.Range(int.MinValue, int.MaxValue);
        offset.x = Random.Range(-100000, 100000);
        offset.y = Random.Range(-100000, 100000);
    }
    public void GenerateMap()
    {
        float[,] noiseMap = Noise.GenerateNoiseMap(width, height, seed, noiseScale, octaves, persistance, lacunarity, offset);

        colorMap = new Color[width * height];

        /////////////////////////////////////////////////////////////////
        GradientColorKey[] colors = new GradientColorKey[regoins.Length];
        GradientAlphaKey[] alphas = new GradientAlphaKey[regoins.Length];
        for (int i = 0; i < regoins.Length; i++)
        {
            colors[i].color = regoins[i].color;
            colors[i].time = regoins[i].height;
            alphas[i].alpha = 1;
            alphas[i].time = regoins[i].height;
        }
        gradient.SetKeys(colors,alphas);
        /////////////////////////////////////////////////////////////////
        
        for (int y = 0; y < height; y++)
        {

            for (int x = 0; x < width; x++)
            {
                if (useFallOff)
                {
                    noiseMap[x, y] = Mathf.Clamp(noiseMap[x, y] - fallOffMap[x, y] * 0.5f, 0, 1);
                }
                float currentHeight = noiseMap[x, y];

                colorMap[y * width + x] = gradient.Evaluate(currentHeight);

            }
        }

        MapDisplay display = FindObjectOfType<MapDisplay>();
        if (drawMode == DrawMode.NoiseMap)
        {
            display.DrawTexture(TextureGenerator.TextureFromHeightMap(noiseMap));
        }
        else if (drawMode == DrawMode.ColorMap)
        {
            display.DrawTexture(TextureGenerator.TextureFromColorMap(colorMap, width, height));
        }
        else if (drawMode == DrawMode.FallOffMap)
        {
            display.DrawTexture(TextureGenerator.TextureFromHeightMap(FallOffMap.GenerateFallOffMap(width, height)));
        }
        else if (drawMode == DrawMode.TemperatureMap)
        {
            display.DrawTexture(TextureGenerator.TextureFromHeightMap(FallOffMap.GenerateFallOffMap(width, height)));
        }

    }
    
    private void OnValidate()
    {
        if (size < 1) size = 1;
        width = size * 2;
        height = size;
        if (lacunarity < 1) lacunarity = 1;
        if (octaves < 0) octaves = 0;
        fallOffMap = FallOffMap.GenerateFallOffMap(width, height);

    }
}
[System.Serializable]
public struct TerrainType
{
    public string name;
    public float height;
    public Color color;
}
[System.Serializable]
public struct SavedTerrain
{
    private int height;
    private int width;
    private float scale;
    private int octaves;
    private float persitance;
    private float lacunarity;
    private Gradient gradient;
    private int seed;
    private Vector2 offset;
    public Texture2D texture;

    public int Height { get => height; set => height = value; }
    public int Width { get => width; set => width = value; }
    public float Scale { get => scale; set => scale = value; }
    public int Octaves { get => octaves; set => octaves = value; }
    public float Persitance { get => persitance; set => persitance = value; }
    public float Lacunarity { get => lacunarity; set => lacunarity = value; }
    public Gradient Gradient { get => gradient; set => gradient = value; }
    public Vector2 Offset { get => offset; set => offset = value; }
    public int Seed { get => seed; set => seed = value; }
    public Texture2D Texture { get => texture; set => texture = value; }
}
```

### Texture Generator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class TextureGenerator
{
    public static Texture2D TextureFromColorMap(Color[] colorMap,int width, int height)
    { 
        Texture2D texture = new(width, height);
        texture.filterMode = FilterMode.Point;
        texture.wrapMode = TextureWrapMode.Clamp;
        texture.SetPixels(colorMap);
        texture.Apply();
        return texture;
    }
    public static Texture2D TextureFromHeightMap(float [,] heightMap)
    {
        int width = heightMap.GetLength(0);
        int height = heightMap.GetLength(1);

        Texture2D texture = new Texture2D(width, height);

        Color[] colorMap = new Color[width * height];
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                colorMap[y * width + x] = Color.Lerp(Color.black, Color.white, heightMap[x, y]);
            }
        }
        return TextureFromColorMap(colorMap,width,height);
    }
}
```

### Map Display

```csharp
using UnityEngine;

public class MapDisplay : MonoBehaviour
{
    public new Renderer renderer;

    public void DrawTexture(Texture2D texture)
    { 
        renderer.sharedMaterial.mainTexture = texture;
        renderer.transform.localScale = new Vector3(texture.width, 1,texture.height);
    }
}
```

### Noise Generator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class Noise
{
    public static float[,] GenerateNoiseMap(int mapWidth, int mapHeigth, int seed, float scale, int octaves, float persistance, float lacunarity, Vector2 offset)
    {
        System.Random sRandom = new System.Random(seed);
        Vector2[] offsets = new Vector2[(int) (octaves)];
        for(int i = 0; i< octaves; i++)
        {
            float offsetX = sRandom.Next(-100000,100000) + offset.x;
            float offsetY = sRandom.Next(-100000, 100000) +offset.y;
            offsets[i] = new Vector2(offsetX, offsetY);
        }
        float[,] noiseMap = new float[mapWidth, mapHeigth];
        if (scale <= 0)
        {
            scale = 0.0001f;
        }
        float maxNosieHeight = float.MinValue;
        float minNoiseHeight = float.MaxValue;

        float halfW = mapWidth / 2f;
        float halfH = mapHeigth / 2f;

        for (int y = 0; y < mapHeigth; y++)
        {

            for (int x = 0; x < mapWidth; x++)
            {
                float amplitude = 1;
                float frequency = 1;
                float noiseHeight = 0;
                for (int i = 0; i < octaves; i++){

                    float sampleX = (x - halfW) / scale * frequency + offsets[i].x;
                    float sampleY = (y - halfH) / scale  * frequency + offsets[i].y;

                    float perlinValue = Mathf.PerlinNoise(sampleX, sampleY) * 2 - 1;
                    noiseHeight += perlinValue * amplitude;

                    amplitude *= persistance;
                    frequency *= lacunarity;
                    
                }
                if(noiseHeight > maxNosieHeight)
                {
                    maxNosieHeight = noiseHeight;
                } else if( noiseHeight < minNoiseHeight)
                {
                    minNoiseHeight = noiseHeight;
                }
                noiseMap[x, y] = noiseHeight;
            }
        }
        for (int y = 0; y < mapHeigth; y++)
        {

            for (int x = 0; x < mapWidth; x++)
            {
                noiseMap[x, y] = Mathf.InverseLerp(minNoiseHeight,maxNosieHeight,noiseMap[x, y]);
            }
        }
                return noiseMap;
    }
}
```

### Generator Editor

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEditor;
[CustomEditor(typeof(MapGenerator))]
public class MapGenerateEditor : Editor
{
    public override void OnInspectorGUI() {
        MapGenerator mapGenerate = (MapGenerator)target;

        if (DrawDefaultInspector() && mapGenerate.autoUpdate) {
            mapGenerate.GenerateMap();
        }
        if(GUILayout.Button("Random Seed")){
            mapGenerate.randomSeed();
            mapGenerate.GenerateMap();
        }
        if (GUILayout.Button("AutoSaved"))
        {
            mapGenerate.autoSaved();
        }
    }
}
```

### Fall Off Generation

```csharp
using UnityEngine;

public static class FallOffMap
{
    public static float[,] GenerateFallOffMap(int width, int height)
    {
        float[,] map = new float[width, height];
        Vector2 center = new(width / 2f, height / 2f);
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float borderY = y / (float)height * 2 - 1;
                float radius = Vector2.Distance(center, new(x, y));
                float radiusR = Vector2.Distance(center, new(x / 2f, y));
                float radiusL = Vector2.Distance(new(0, height / 2f), new(x / 2f, y));
                float value = Evaluate(Mathf.Abs(borderY));
                float rightConer = Rounded(ValueCaculator(radiusR, width));
                float leftCornner = Rounded(ValueCaculator(radiusL, width));
                float main = Rounded(ValueCaculator(radius, width));
                map[x, y] = Mathf.Max(value * 0.2f, Mathf.Max(main, rightConer + leftCornner));
            }

        }
        return map;
    }
    static float ValueCaculator(float radius, int width)
    {
        float borderSize = 1.8375f;
        return (0.5f - (radius / (width * borderSize))) * 6.5f;
    }
    static float Evaluate(float value)
    {
        float a = 7f;
        float b = 4f;
        return Mathf.Pow(value, a) / (Mathf.Pow(value, a) + Mathf.Pow(b - b * value, a));
    }
    static float Rounded(float value)
    {
        float a = 5f;
        float c = 3.75f;
        float b = 7f;
        return Mathf.Pow(value, a) - Mathf.Pow(c, b) / (Mathf.Pow(value, a) + Mathf.Pow(b - b * value, b)) - Mathf.Pow(value, a);
    }
}
```

### Preference

![Noise Map Generation](Untitled%201.png)

Noise Map Generation

![Fall-off Map Generation ](fallOf.png)

Fall-off Map Generation 

![Color Map Generation](335769087_719227949684702_4041203576884744808_n.png)

Color Map Generation

[](https://www.notion.so)