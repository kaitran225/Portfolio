# DevLog#8 Procedual Terrain Generator

Tags: Stable
Date: March 23, 2023
Person: Nguyên Khánh Trần

### MapGenerateEditor

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
        if (GUILayout.Button("Generate"))
        {
            mapGenerate.GenerateMap();
        }
        if (GUILayout.Button("Random Seed")){
            mapGenerate.RandomSeed();
            mapGenerate.GenerateMap();
        }
        if (GUILayout.Button("Save Terrain Data"))
        {
            mapGenerate.AutoSaved();
        }
        if (GUILayout.Button("Load Terrain Data"))
        {
            int index = mapGenerate.index;
            mapGenerate.ReGenerateMap(index);
        }
        if (GUILayout.Button("Load"))
        {
            mapGenerate.color = mapGenerate.GenerateColorPalete(mapGenerate.biomes_path);
            mapGenerate.ocean = mapGenerate.GenerateOceanPalete(mapGenerate.ocean_path);
        }
        if (GUILayout.Button("Save to File"))
        {
            mapGenerate.WriteToFile();
        }
        if (GUILayout.Button("Load form File"))
        {
            mapGenerate.LoadFromFile();
        }
    }
}
```

### BioColorRangeMapGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class BioColorRangeMapGenerator
{
    private static bool almostEqual(float a, float b, float eps)
    {
        return Mathf.Abs(a - b) < eps;
    }
    private static Color[] GradientPattern(int width, int height, ColorGrid[] biomes)
    {
        Color[] colorMap = new Color[width * height];

        int index = 0;
        float step = 1f / biomes.Length;
        for (int y = 0; y < height; y++)
        {
            if (almostEqual(step * (index + 1), (float) y / height, 0.05f) && index + 1 < biomes.Length)
            {
                index++;
            }
            MapGenerator.ColorData[] colorData = biomes[index].colorDatas;
            Gradient gradient = CreateGradient(colorData);
            for (int x = 0; x < width; x++)
            {
                float currentHeight = (float) x / width;
                colorMap[y * width + x] = gradient.Evaluate(currentHeight);
            }
        }
        return colorMap;
    }
    public static Color[] BioGeneration(int width, int height, ColorGrid[] biomes)
    {
        Color[] colorMap = GradientPattern(width, height, biomes);
        for (int x = 0; x < width; x++)
        {
            int index = 0;
            int step = height / (biomes.Length);

            for (int y = step / 2; y < height; y += step)
            {
                if (y >= height - step) break;

                Color beginColor = colorMap[y * width + x];
                Color endColor = colorMap[(y + step) * width + x];

                index++;

                Gradient gradient = CreateGradientReverse(beginColor, endColor);

                for (int k = 0; k < step; k++)
                {
                    float currentHeight = (float)k / step;
                    int tempK = y + k;
                    colorMap[tempK * width + x] = gradient.Evaluate(currentHeight);
                }
            }
        }
        return colorMap;
    }
    private static Gradient CreateGradient(MapGenerator.ColorData[] colorData)
    {
        Gradient gradient = new();
        GradientColorKey[] colors = new GradientColorKey[colorData.Length];
        GradientAlphaKey[] alphas = new GradientAlphaKey[colorData.Length];
        float step = (float) 1f / colorData.Length;
        for (int i = 0; i < colorData.Length; i++)
        {
            colors[i].color = colorData[i].color;
            colors[i].time = step * (i + 1);
            alphas[i].alpha = 255;
            alphas[i].time = step * (i + 1);
        }
        gradient.SetKeys(colors, alphas);
        return gradient;
    }
    private static Gradient CreateGradientReverse(Color begin, Color end)
    {
        Gradient gradient = new();
        GradientColorKey[] colors = new GradientColorKey[2];
        GradientAlphaKey[] alphas = new GradientAlphaKey[2];
        colors[0].color = begin;
        colors[0].time = 0;
        colors[1].color = end;
        colors[1].time = 1;
        alphas[0].alpha = 255;
        alphas[1].alpha = 255;
        alphas[0].time = 0;
        alphas[1].time = 1;
        gradient.SetKeys(colors, alphas);
        return gradient;
    }
}
```

### BioDistributionGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class BioDistributionGenerator
{

    public static Color[] BioGeneration(int width, int height, float[,] temperature, float[,] moisture, Color[] biomesMap, float[,] noiseMap, Gradient ocean, float waterLevel, bool useFallOff, float[,] fallOffMap)
    {
        Vector2[,] map = BiomesGeneration(width, height, temperature, moisture);
        Color[] colorMap = CreateBiomeColorMap(width, height, map, biomesMap, noiseMap, ocean, waterLevel,useFallOff, fallOffMap);
        return colorMap;
    }
    private static Vector2[,] BiomesGeneration(int width, int height, float[,] temperature, float[,] moisture)
    {
        Vector2[,] map = new Vector2[width, height];
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                map[x, y] = new Vector2(temperature[x, y], moisture[x, y]);
            }
        }
        return map;
    }
    
    private static Color[] CreateBiomeColorMap(int width, int height, Vector2[,] bioDistribution, Color[] biomesMap, float[,] noiseMap, Gradient ocean, float waterLevel,bool useFallOff,float[,] fallOffMap)
    {
        Color[] colorMap = new Color[width * height];
      
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {

                float temp = bioDistribution[x, y].x;
                float mois = bioDistribution[x, y].y;

                float currentX = temp * width;
                float currentY = mois * height;
                int XX = (int)currentX;
                int YY = (int)currentY;
                XX = Mathf.Clamp(XX, 0, width);
                YY = Mathf.Clamp(YY, 0, height);
                float alternativeWaterHeight = (1f - noiseMap[x, y]);
                float waterHeight = (noiseMap[x,y] > waterLevel ? alternativeWaterHeight : noiseMap[x, y]);
                if (useFallOff)
                {
                    noiseMap[x, y] = Mathf.Clamp01(noiseMap[x, y] - fallOffMap[x, y]);
                }
                float currentHeight = noiseMap[x, y];
                float a = Mathf.Lerp(50f, 0, currentHeight) / 255f;

                Color currentColor = biomesMap[YY * width + XX];
                float r = currentColor.r - a;
                float g = currentColor.g - a;
                float b = currentColor.b - a;

                if (currentHeight <= waterLevel)
                {
                    float index = Mathf.Lerp(0,2,waterHeight);
                    currentColor = ocean.Evaluate(index);
                }
                else { currentColor = new Color(r, g, b, a); }

                colorMap[y * width + x] = currentColor;

            }
        }
        return colorMap;
    }

}
```

### BiomesGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class BiomesGenerator
{
    public static Color[] BioGeneration(int width, int height, float[,] temperature, float[,] moisture, BiomeData[] biomeDatas)
    {
        Vector2[,] map = BiomesGeneration(width,height,temperature,moisture);
        Color[] colorMap = CreateBiomeColorMap(width,height,map, biomeDatas);
        return colorMap;
    }
    private static Vector2[,] BiomesGeneration (int width, int height, float[,] temperature,float[,] moisture)
    {
        Vector2[,] map = new Vector2[width, height];
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                map[x, y] = new Vector2(temperature[x,y],moisture[x,y]);
            }
        }
        return map;
    }
    private static Color[] CreateBiomeColorMap(int width,int height, Vector2[,] bioDistribution, BiomeData[] biomeDatas)
    {
        Color[] colorMap = new Color[width*height];
        
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                var size = biomeDatas.Length;
                for (int i = 0; i < size; i++) {
                    BiomeData data = biomeDatas[i];
                    float temp = bioDistribution[x,y].x;
                    float mois = bioDistribution[x,y].y;
                    float minTemp = (data.temperature.x == 0) ? -0.1f :data.temperature.x;
                    float maxTemp = data.temperature.y;
                    float minMois =  (data.moisture.x == 0)? -0.1f  : data.moisture.x;
                    float maxMois = data.moisture.y;
                    if (temp >= minTemp && temp <= maxTemp && mois > minMois && mois <= maxMois)
                    {
                        colorMap[y * width + x] = data.color;
                        continue;
                    }
                }
            }
        }
                return colorMap;
    } 

}
```

### FallOffMap

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
                map[x, y] = Mathf.Clamp01(  Mathf.Max(main, rightConer + leftCornner));
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

### MapGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using System.IO;
using UnityEngine;

public class MapGenerator : MonoBehaviour
{

    public enum DrawMode { NoiseMap, BiomesMap, BioGradientColorRange, BiomeDistributionMap }
    [Header("Basic")]
    public DrawMode drawMode;
    public int size;
    [Range(0, 1)]
    public float waterLevel;
    private float noiseScale;

    private Gradient grayscale;

    public bool autoUpdate;
    public bool useFallOff;
   

    public Vector2 offset;
    public Vector2 mOffset;
    [HideInInspector]
    public ColorGrid[] color;
    [HideInInspector]
    public ColorData[] ocean;
    public int index;
    public List<SavedTerrain> savedTerrain;

    private int height = 0;
    private int width = 0;
    private readonly int octaves = 12;
    private readonly float persistance = 0.58f;
    private readonly float lacunarity = 2f;
    private int seed;

    private int mSeed;

    private float[,] noiseMap;
    private float[,] fallOffMap;
    private float[,] heightTempMap;
    private float[,] heightMoistureMap;

    private Color[] bioColorRangeMap;
    private Color[] colorMap;
    [HideInInspector]
    public string biomes_path = "E:\\Map Generation\\Assets\\colorBiomes.txt";[HideInInspector]
    public string ocean_path = "E:\\Map Generation\\Assets\\colorOcean.txt";
    [HideInInspector]
    public string save_file_path = "Assets\\SavedTerrainData.txt";
    public void GenerateMap()
    {
        noiseMap = Noise.GenerateNoiseMap(width, height, seed, noiseScale, octaves, persistance, lacunarity, offset);

        fallOffMap = FallOffMap.GenerateFallOffMap(width, height);

        heightTempMap = TemperaturGenerator.TemperatureMapGeneration(width, height, noiseMap, fallOffMap, useFallOff);

        heightMoistureMap = MoistureGenerator.MoistureGenerate(width, height, noiseScale, octaves, persistance, lacunarity, mSeed, mOffset, noiseMap, fallOffMap, useFallOff);

        colorMap = new Color[width * height];

        grayscale = CreateGradient();

        MapDisplay display = FindObjectOfType<MapDisplay>();
        switch (drawMode)
        {
            case DrawMode.NoiseMap:
                colorMap = CreateColorMap(noiseMap, useFallOff, grayscale, fallOffMap);
                break;
            case DrawMode.BioGradientColorRange:
                colorMap = BioColorRangeMapGenerator.BioGeneration(width, height, color);
                break;
            case DrawMode.BiomeDistributionMap:
                bioColorRangeMap = BioColorRangeMapGenerator.BioGeneration(width, height, color);
                colorMap = BioDistributionGenerator.BioGeneration(width, height, heightTempMap, heightMoistureMap, bioColorRangeMap, noiseMap, CreateGradient(ocean), waterLevel, useFallOff, fallOffMap);
                break;
            default:
                display.DrawTexture(TextureGenerator.TextureFromColorMap(colorMap, width, height));
                break;
        }
        display.DrawTexture(TextureGenerator.TextureFromColorMap(colorMap, width, height));
    }
    public void ReGenerateMap(int index)
    {
        index--;
        SavedTerrain saved = savedTerrain[index];
        size = saved.Size;
        noiseScale = saved.Scale;
        offset = saved.Offset;
        mOffset = saved.MOffest;
        seed = saved.Seed;
        mSeed = saved.MSeed;
        waterLevel = saved.WaterLevel;
        GenerateMap();
    }
    public void AutoSaved()
    {
        SavedTerrain saved = new();
        saved.Size = size;
        saved.Scale = noiseScale;
        saved.Offset = offset;
        saved.MOffest = mOffset;
        saved.WaterLevel = waterLevel;
        saved.Seed = seed;
        saved.MSeed = mSeed;
        savedTerrain.Add(saved);
    }
    public void RandomSeed()
    {
        seed = Random.Range(int.MinValue, int.MaxValue);
        offset.x = Random.Range(-100000, 100000);
        offset.y = Random.Range(-100000, 100000);
        mSeed = Random.Range(int.MinValue, int.MaxValue);
        mOffset.x = Random.Range(-100000, 100000);
        mOffset.y = Random.Range(-100000, 100000);
    }
    private Gradient CreateGradient()
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
    private Gradient CreateGradient(ColorData[] colorData)
    {
        Gradient gradient = new();
        GradientColorKey[] colors = new GradientColorKey[colorData.Length];
        GradientAlphaKey[] alphas = new GradientAlphaKey[colorData.Length];
        for (int i = 0; i < colorData.Length; i++)
        {
            colors[i].color = colorData[i].color;
            colors[i].time = colorData[i].height;
            alphas[i].alpha = 255;
            alphas[i].time = colorData[i].height;
        }
        gradient.SetKeys(colors, alphas);
        return gradient;
    }
    public Color[] CreateColorMap(float[,] noiseMap, bool fallOffCondition, Gradient gradient, float[,] fallOffMap)
    {
        Color[] colorMap = new Color[width * height];
        for (int y = 0; y < height; y++)
        {

            for (int x = 0; x < width; x++)
            {
                if (fallOffCondition)
                {
                    noiseMap[x, y] = Mathf.Clamp01(noiseMap[x, y] - fallOffMap[x, y]);
                }
                float currentHeight = noiseMap[x, y];
                colorMap[y * width + x] = gradient.Evaluate(currentHeight);
            }
        }
        return colorMap;
    }
    public void WriteToFile()
    {
        List<string> list = new();
        var theTime = System.DateTime.Now.ToString("hh:mm:ss");
        var theDate = System.DateTime.Today.ToString("dddd, dd MMMM, yyyy");
        for (int i = 0; i < savedTerrain.Count; i++)
        {
            SavedTerrain s = savedTerrain[i];
            list.Add("\n");
            list.Add("////////////////////////////////////////");
            list.Add(theTime);
            list.Add(theDate);
            list.Add("////////////////////////////////////////");
            list.Add("\n");
            list.Add("@Start");
            foreach (var prop in s.GetType().GetProperties())
            {
                list.Add(prop.Name + ": " + prop.GetValue(s));
            }
            list.Add("@End");
        }
        StreamWriter outp_stm = new(save_file_path,true);
        for (int i = 0; i < list.Count; i++)
        {
            outp_stm.WriteLine(list[i]);
        }
        outp_stm.Close();
    }
    public void LoadFromFile()
    {
        StreamReader inp_stm = new StreamReader(save_file_path);
        bool condition = false;
        List<string> list = new();
        while (!inp_stm.EndOfStream)
        {
            string inp_ln = inp_stm.ReadLine();
            if (inp_ln.Equals("@Start") && !condition) condition = !condition;
            if (inp_ln.Equals("@End") && condition) condition = !condition;
            if (condition && !inp_ln.Equals("@Start"))
            {
                list.Add(inp_ln);
            };
        }
        inp_stm.Close();
        for (int i = 0; i < list.Count / 8; i++)
        {
            SavedTerrain terrain = new();
            string s = (list[i*8 + 0]).Split(":")[1];
            terrain.Size = int.Parse(s.Trim());
            s = (list[i * 8 + 1]).Split(":")[1];
            terrain.Scale = float.Parse(s.Trim());
            s = (list[i * 8 + 2]).Split(":")[1];
            terrain.Seed = int.Parse(s.Trim()) ;
            s = (list[i * 8 + 3]).Split(":")[1];
            terrain.Offset = StringToVector2(s.Trim());
            s = (list[i * 8 + 4]).Split(":")[1];
            terrain.MSeed = int.Parse(s.Trim());
            s = (list[i * 8 + 5]).Split(":")[1];
            terrain.MOffest = StringToVector2(s.Trim());
            s = (list[i * 8 + 6]).Split(":")[1];
            terrain.WaterLevel = float.Parse(s.Trim());
            s = (list[i * 8 + 7]).Split(":")[1];
            terrain.Comment = s;
            savedTerrain.Add(terrain);
        }
    }
    private Vector2 StringToVector2(string str)
    {
        str = str.Trim();
        str = str.Substring(1, str.Length - 2);
        string[] s = str.Split(",");
        float a = float.Parse(s[0].Trim());
        float b = float.Parse(s[1].Trim());

        return new(a,b);
    }
    public ColorData[] GenerateOceanPalete(string ocean_path)
    {
        StreamReader inp_stm = new(ocean_path);

        List<string> list = new();
        while (!inp_stm.EndOfStream)
        {
            string inp_ln = inp_stm.ReadLine();
            if (!(inp_ln.Trim()).Equals(""))
            {
                list.Add(inp_ln);
            };

        }
        inp_stm.Close();
        ColorData[] ocean = new ColorData[list.Count];
        for (int i = 0; i < ocean.Length; i++)
        {
            MapGenerator.ColorData data = new();
            string[] color = list[i].Split(",");
            float r = float.Parse(color[0].Trim());
            r /= 255f;
            float g = float.Parse(color[1].Trim());
            g /= 255f;
            float b = float.Parse(color[2].Trim());
            b /= 255f;
            data.color = new Color(r, g, b, 1);
            data.height = float.Parse(color[3].Trim());
            data.name = color[4];
            ocean[i] = data;
        }
        return ocean;
    }

    public ColorGrid[] GenerateColorPalete(string biome_path)
    {
        StreamReader inp_stm = new StreamReader(biome_path);
        ColorGrid[] colorGrid = new ColorGrid[8];
        List<string> list = new();
        while (!inp_stm.EndOfStream)
        {
            string inp_ln = inp_stm.ReadLine();
            if (!(inp_ln.Trim()).Equals(""))
            {
                list.Add(inp_ln);
            };

        }
        inp_stm.Close();
        for (int i = 0; i < colorGrid.Length; i++)
        {

            MapGenerator.ColorData[] colorDatas = new MapGenerator.ColorData[8];
            for (int k = 0; k < colorDatas.Length; k++)
            {
                MapGenerator.ColorData data = new();
                string[] color = list[i * colorDatas.Length + k].Split(",");
                float r = float.Parse(color[0].Trim());
                r = r / 255f;
                float g = float.Parse(color[1].Trim());
                g = g / 255f;
                float b = float.Parse(color[2].Trim());
                b = b / 255f;
                data.color = new Color(r, g, b, 1);
                data.name = color[3].Trim();
                colorDatas[k] = data;

            }
            colorGrid[i].colorDatas = colorDatas;
        }

        return colorGrid;
    }
    private void OnValidate()
    {
        if (size < 100) size = 100;
        width = size * 2;
        height = size;
        noiseScale = size / (2f);
        if (index < 0) index = 0;
        if (index >= savedTerrain.Count) index = savedTerrain.Count;
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
        
        public string comment;
        private int size;
        private float scale;

        private int seed;
        private Vector2 offset;

        private int mSeed;
        private Vector2 mOffest;
        private float waterLevel;

        public int Size { get => size; set => size = value; }
        public float Scale { get => scale; set => scale = value; }
        public int Seed { get => seed; set => seed = value; }
        public Vector2 Offset { get => offset; set => offset = value; }
        public int MSeed { get => mSeed; set => mSeed = value; }
        public Vector2 MOffest { get => mOffest; set => mOffest = value; }
        public float WaterLevel { get => waterLevel; set => waterLevel = value; }
        public string Comment { get => comment; set => comment = value; }
    }
}

[System.Serializable]
public struct BiomeData
{
    public string name;
    public Vector2 moisture;
    public Vector2 temperature;
    public Color color;

}
[System.Serializable]
public struct ColorGrid
{
    public MapGenerator.ColorData[] colorDatas;
}
```

### MoistureGenerator

```csharp
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class MoistureGenerator
{

    public static float[,] MoistureGenerate(int width, int height, float noiseScale, int octaves, float persistance, float lacunarity, int seed, Vector2 offset, float[,] noiseMap,float[,] fallOffMap, bool useFallOff)
    {
        float[,] map = Noise.GenerateNoiseMap(width, height, seed, noiseScale, octaves, persistance, lacunarity, offset);
        for (int y = 0; y < height; y++)
        {

            for (int x = 0; x < width; x++)
            {
                float borderY = y / (float)height * 2 - 1;
                float va = Evaluation(Mathf.Abs(borderY));
                float value = noiseMap[x, y];
                float moise = map[x, y];
                map[x, y] = Mathf.Clamp01( Evaluate(value) * 0.3f + moise * 0.7f - va* 0.25f);
                if (useFallOff)
                {
                    map[x, y] = Mathf.Clamp01(map[x, y] - fallOffMap[x, y] * 0.5f);
                }
            }
        }
        return map;
    }
    static float Evaluate(float value)
    {
        return 0 - Mathf.Pow(value,3)/3 + 0.542f;
    }
    static float Evaluation(float value)
    {
        float a = 2f;
        float b = -2f;
        return Mathf.Pow(value, a) / (Mathf.Pow(value, a) + Mathf.Pow(b - b * value, a));
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
    public static float[,] TemperatureMapGeneration(int width, int height, float[,] noiseTemp, float[,] fallOffMap, bool useFallOff)
    {
        float[,] temp = ReContructTempMap(width, height, noiseTemp);
        float equator = height * 0.1f /2;
        float[,] map = new float[width, height];
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float value = (float)y / (height / 2f - equator);
                float borderY = y / (float)height * 2f - 1;
                float va = Evaluate(Mathf.Abs(borderY));
                if (y >= height / 2)
                {
                    value = (float)(height - y) / (height / 2f - equator);
                }

                map[x, y] = Mathf.Clamp01(value * 0.65f + (temp[x, y]) * 0.35f + va * 0.1f);
                if (useFallOff)
                {
                    map[x, y] = Mathf.Clamp01(map[x, y] - fallOffMap[x, y] * 0.5f);
                }
            }
        }
        return map;
    }
    static bool almostEqual(float a, float b, float eps)
    {
        return Mathf.Abs(a - b) < eps;
    }
    static float Evaluate(float value)
    {
        float a = 2f;
        float b = 3f;
        return Mathf.Pow(value, a) / (Mathf.Pow(value, a) + Mathf.Pow(b - b * value, a));
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

### BiomesColor

```csharp
233,232,238, Cold Desert
233,228,131, Mid-Latitude Desert
233,228,131, Mid-Latitude Desert
233,228,131, Mid-Latitude Desert
233,228,131, Mid-Latitude Desert
216,200,131, Sub-Tropical Desert
251,248,199, Desert
251,248,199, Desert

131,160,117, Tundras
131,160,117, Tundras
128,145,94, Temperate Grassland
180,174,98, Temperate Savanna
180,174,98, Temperate Savanna
132,147,92, Tropical Savanna
216,200,131, Sub-Tropical Desert
251,248,199, Desert

131,160,117, Tundras
131,160,117, Tundras
180,174,98, Temperate Savanna
94,105,65, Woodland
128,145,94, Temperate Grassland
132,147,92, Tropical Savanna
132,147,92, Tropical Savanna
216,200,131, Sub-Tropical Desert

101,124,94, Boreal Conifer
180,174,98, Temperate Savanna
68,96,61, Boreal Forest
104,160,104, Temperate Deciduous Forest
94,105,65, Woodland
84,105,72, Monsoon Rain Forest
84,105,72, Monsoon Rain Forest
132,147,92, Tropical Savanna

101,124,94, Boreal Conifer
101,124,94, Boreal Conifer
68,96,61, Boreal Forest
95,125,55, Temperate Evergreen Forest
69,107,69, Sub-Tropical Rain Forest
84,105,72, Monsoon Rain Forest
84,105,72, Monsoon Rain Forest
84,105,72, Monsoon Rain Forest

101,124,94, Boreal Conifer
101,124,94, Boreal Conifer
104,160,104, Temperate Deciduous Forest
95,125,55, Temperate Evergreen Forest
69,107,69, Sub-Tropical Rain Forest
84,105,72, Monsoon Rain Forest
51,81,52, Tropical Rain Forest
51,81,52, Tropical Rain Forest

68,96,61, Boreal Forest
68,96,61, Boreal Forest
95,125,55, Temperate Evergreen Forest
69,107,69, Sub-Tropical Rain Forest
69,107,69, Sub-Tropical Rain Forest
51,81,52, Tropical Rain Forest
51,81,52, Tropical Rain Forest
51,81,52, Tropical Rain Forest

68,96,61, Boreal Forest
68,96,61, Boreal Forest
95,125,55, Temperate Evergreen Forest
69,107,69, Sub-Tropical Rain Forest
69,107,69, Sub-Tropical Rain Forest
51,81,52, Tropical Rain Forest
51,81,52, Tropical Rain Forest
51,81,52, Tropical Rain Forest
```

### OceanColor

```csharp
16,56,76,0.35,Ocean Floor
16,76,86,0.58,Deep Water
16,86,106,0.75, Water
26,96,116,0.88,Shallow Water
26,106,126,1, Coast
```

![Untitled](Untitled%205.png)