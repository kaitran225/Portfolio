# DevLog#6 Procedual Terrain Generator

Date: March 23, 2023
Person: Nguyên Khánh Trần

### MapDisplay

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

### FallOffMap

```
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
map[x, y] = Mathf.Max(value * 0.2f,  Mathf.Max(main, rightConer + leftCornner));
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
    return - Mathf.Pow(c, b) / (Mathf.Pow(value, a) + Mathf.Pow(b - b * value, b));
}
}
```

### MapGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class MapGenerator : MonoBehaviour
{
public enum DrawMode { NoiseMap, ColorMap, FallOffMap, TemperatureMap, MoistureMap }
[Header("Basic")]
public DrawMode drawMode;
public int size;
public float noiseScale;

private int octaves = 12;
private float persistance = 0.58f;
private float lacunarity = 2f;

[Header("Color Range")]
public Gradient heightMapColorRange;
public Gradient temperatureColorRange;
public Gradient moistureColorRange;
public Gradient grayscale;

public bool autoUpdate;
public bool useFallOff;

public Vector2 offset;
private int seed;

public ColorData[] regoins;
public ColorData[] temperature;
public ColorData[] moisture;

public List<SavedTerrain> savedTerrain;

private int height;
private int width;

public float mScale;

public int mOctaves;
public float mPersistance;
public float mLacunarity;
public Vector2 mOffset;
private int mSeed;
private void Awake()
{

}

public void GenerateMap()
{
    float[,] noiseMap = Noise.GenerateNoiseMap(width, height, seed, noiseScale, octaves, persistance, lacunarity, offset);

    float[,] heightTempMap = TemperaturGenerator.TemperatureMapGeneration(width, height, noiseMap);

    float[,] heightMoistureMap = MoistureGenerator.MoistureGenerate(width, height, mScale,mOctaves,mPersistance,mLacunarity,mSeed, mOffset,noiseMap);

    float[,] fallOffMap = FallOffMap.GenerateFallOffMap(width, height);

    Color[] colorMap = new Color[width * height];
    Color[] tempMap = new Color[width * height];

    heightMapColorRange = createGradient(regoins);
    temperatureColorRange = createGradient(temperature);
    moistureColorRange = createGradient(moisture);
    grayscale = createGradient();

    MapDisplay display = FindObjectOfType<MapDisplay>();
    switch (drawMode)
    {
        case DrawMode.NoiseMap:
            colorMap = CreateColorMap(noiseMap, useFallOff, grayscale, fallOffMap);
            break;
        case DrawMode.ColorMap:
            colorMap = CreateColorMap(noiseMap, useFallOff, heightMapColorRange, fallOffMap);
            break;
        case DrawMode.FallOffMap:
            colorMap = CreateColorMap(fallOffMap, useFallOff, grayscale, fallOffMap);
            break;
        case DrawMode.TemperatureMap:
            colorMap = CreateColorMap(heightTempMap, useFallOff, temperatureColorRange, fallOffMap);
            tempMap = CreateColorMap(noiseMap, useFallOff, heightMapColorRange, fallOffMap);
            for (int y = 0; y < height; y++)
            {

                for (int x = 0; x < width; x++)
                {
                    if (noiseMap[x, y] <= 0.5f)
                    {
                        colorMap[y * width + x] = tempMap[y * width + x];
                    }
                }
            }
            break;
        case DrawMode.MoistureMap:
            colorMap = CreateColorMap(heightMoistureMap, false, moistureColorRange, fallOffMap);
            tempMap = CreateColorMap(noiseMap, useFallOff,heightMapColorRange, fallOffMap);
            for (int y = 0; y < height; y++)
            {

                for (int x = 0; x < width; x++)
                {
                    if (noiseMap[x, y] <= 0.5f)
                    {
                        colorMap[y * width + x] = tempMap[y * width + x];
                    }
                }
            }
            break;
        default:
            display.DrawTexture(TextureGenerator.TextureFromColorMap(colorMap, width, height));
            break;

    }
    display.DrawTexture(TextureGenerator.TextureFromColorMap(colorMap, width, height));

}
public void autoSaved()
{
    SavedTerrain saved = new();
    saved.Height = height;
    saved.Width = width;

    saved.Scale = noiseScale;
    saved.Seed = seed;
    saved.Offset = offset;

    saved.Persitance = persistance;
    saved.Octaves = octaves;
    saved.Lacunarity = lacunarity;

    saved.Gradient = heightMapColorRange;

    savedTerrain.Add(saved);
}
public void randomSeed()
{
    seed = Random.Range(int.MinValue, int.MaxValue);
    offset.x = Random.Range(-100000, 100000);
    offset.y = Random.Range(-100000, 100000);
    mSeed = Random.Range(int.MinValue, int.MaxValue);
    mOffset.x = Random.Range(-100000, 100000);
    mOffset.y = Random.Range(-100000, 100000);
}
private Gradient createGradient()
{
    Gradient gradient = new();
    GradientColorKey[] colors = new GradientColorKey[2];
    GradientAlphaKey[] alphas = new GradientAlphaKey[2];
    colors[0].color = Color.black;
    colors[0].time = 0;
    colors[1].color = Color.white;
    colors[1].time = 1;
    alphas[0].alpha = 255;
    alphas[1].alpha = 255;
    alphas[0].time = 1;
    alphas[1].time = 0;
    gradient.SetKeys(colors, alphas);
    return gradient;
}
private Gradient createGradient(ColorData[] colorData)
{
    Gradient gradient = new();
    GradientColorKey[] colors = new GradientColorKey[colorData.Length];
    GradientAlphaKey[] alphas = new GradientAlphaKey[colorData.Length];
    for (int i = 0; i < colorData.Length; i++)
    {
        colors[i].color = colorData[i].color;
        colors[i].time = colorData[i].height;
        alphas[i].alpha = 1;
        alphas[i].time = colorData[i].height;
    }
    gradient.SetKeys(colors, alphas);
    return gradient;
}
public Color[] CreateColorMap(float[,] noiseMap, bool fallOffCondition, Gradient gradient, float[,] fallOffMap)
{
    Color[] colorMap = new Color[width * height];
    float[,] map = new float[width, height];
    for (int y = 0; y < height; y++)
    {

        for (int x = 0; x < width; x++)
        {
            if (fallOffCondition)
            {
                noiseMap[x, y] = Mathf.Clamp(noiseMap[x, y] - fallOffMap[x, y] * 0.5f, 0, 1);
            }
            float currentHeight = noiseMap[x, y];
            colorMap[y * width + x] = gradient.Evaluate(currentHeight);
        }
    }
    return colorMap;
}

private void OnValidate()
{
    if (size < 1) size = 1;
    width = size * 2;
    height = size;
}
[System.Serializable]
public struct ColorData
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
}
```

### MoistureGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class MoistureGenerator
{
public static float[,] MoistureGenerate(int width, int height, float noiseScale, int octaves, float persistance, float lacunarity, int seed, Vector2 offset, float[,] noiseMap)
{
    float[,] map = Noise.GenerateNoiseMap(width, height, seed, noiseScale, octaves, persistance, lacunarity, offset);
    for (int y = 0; y < height; y++)
    {

        for (int x = 0; x < width; x++)
        {
            float value = noiseMap[x, y];
            float moise = map[x, y];
            map[x, y] = Evaluate(value) * 0.3f + moise * 0.7f;
        }
    }
    return map;
}
static float Evaluate(float value)
{
    return 0 - Mathf.Pow(value,3)/3 + 0.542f;
}
}
```

### Noise

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

### TemperaturGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class TemperaturGenerator
{
private static float[] NoiseTempMapCurve(int width, int height, float[,] noiseTemp, int step)
{
float[] randomZone = new float[width];
    for (int i = 0; i < width; i++)
    {
        randomZone[i] = noiseTemp[i, height / 2 + step];
    }
    return randomZone;
}
private static float[,] TempCurve(int width, int height, float[,] noiseTemp)
{
    float[] randomZone = NoiseTempMapCurve(width, height, noiseTemp, 0);
    float[,] temp = new float[width, height];
    for (int y = 0; y < height; y++)
    {
        randomZone = NoiseTempMapCurve(width, height, noiseTemp, (y > height / 2f) ? 0 : height / 4);
        for (int x = 0; x < width; x++)
        {
            float distance = 1 - (float)Vector2.Distance(new(x, height), new(x, y * 2f)) / height;
            temp[x, y] = almostEqual(distance, randomZone[x], 0.05f) ? 0.5f : 0;
        }
    }
    return temp;
}
private static float[,] ReContructTempMap(int width, int height, float[,] noiseTemp)
{
    float[,] temp = TempCurve(width, height, noiseTemp);
    float[,] map = new float[width, height];

    for (int x = 0; x < width; x++)
    {
        int tmp = 0;
        Vector2 currentPosition = new();
        while (temp[x, tmp] == 0)
        {
            currentPosition = new(x, tmp);
            tmp++;
        }
        float distance = Vector2.Distance(currentPosition, new(x, height / 2f));
        for (int y = 0; y < height / 2; y++)
        {
            float value = (y - currentPosition.y) / distance;
            if (y <= currentPosition.y)
            {
                value = (float)y / (currentPosition.y);
                map[x, y] = SinClamp(value);
                continue;
            }
            map[x, y] = SinClamp(value) + 0.5f;

        }
        tmp = height / 2;
        currentPosition = new();
        while (temp[x, tmp] == 0)
        {
            currentPosition = new(x, tmp);
            if (tmp >= height) break;
            tmp++;
        }
        distance = Vector2.Distance(currentPosition, new(x, height));
        for (float y = (height / 2); y < height; y++)
        {
            float value = (y - currentPosition.y) / distance;
            if (y <= currentPosition.y)
            {
                value = (float)(y - (height / 2)) / (currentPosition.y - height / 2);
                //clamp the value up
                map[x, (int)y] = 0 - SinClamp(value) + 1;
                continue;
            }
            map[x, (int)y] = 0 - SinClamp(value) + 0.5f;
        }
    }
    return map;
}
private static float SinClamp(float value)
{
    return Mathf.Sin(value / 1.91f);
}
public static float[,] TemperatureMapGeneration(int width, int height, float[,] noiseTemp)
{
    float[,] temp = ReContructTempMap(width, height, noiseTemp);
    float equator = height * 0.3f /2;
    float[,] map = new float[width, height];
    for (int y = 0; y < height; y++)
    {
        for (int x = 0; x < width; x++)
        {
            float value = (float)y / (height / 2f - equator);
            if (y >= height / 2)
            {
                value = (float)(height - y) / (height / 2f - equator);
            }
            map[x, y] = value * 0.65f + Evaluate(temp[x,y],10f) *0.35f;

        }
    }
    return map;
}
static bool almostEqual(float a, float b, float eps)
{
    return Mathf.Abs(a - b) < eps;
}
static float Evaluate(float value, float step)
{
    value *= step;
    float c = -1f;
    float y1 = -(value - Mathf.Sin(value));
    float y2 = y1 / c + Mathf.Sin(y1 / c);
    float y3 = y2 - Mathf.Sin(y2);
    float y4 = y3 + Mathf.Sin(y2) * 0.25f;
    float y5 = y4 - (Mathf.Sin(y3 / 11.5f * Mathf.PI));
    float y6 = y5 - Mathf.Sin(y4 * 1.2f) / Mathf.Pow(2 * 1.4f, Mathf.Cos(1.4f));
    return y6 / step;
}
}
```

### TextureGenerator

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

![Untitled](Untitled%202.png)

![Untitled](Untitled%203.png)