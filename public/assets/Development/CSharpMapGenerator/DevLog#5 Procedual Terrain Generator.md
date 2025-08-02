# DevLog#5 Procedual Terrain Generator

Date: March 21, 2023
Person: Hoàng Nguyễn

### TemperatureGenerator

```csharp
using System;
using UnityEngine;

public static class TemperatureGenerator
{
    public static float[,] TemperatureMapGeneration(int width, int height)
    {
        float[,] map = new float[width, height];
        float scale = 0.05f;
        for (int y = 0; y < height; y++)
        {
            for (int x = 0; x < width; x++)
            {
                float value = (float)y / (height / 3f);
                if (y >= height / 2)
                {
                    value = (float)(height - y) / (height / 3f);
                }
                float noise = Mathf.PerlinNoise(x * scale, y * scale) * 3.543f - 0.4f;
                map[x, y] = Evaluate(value) + noise * 0.1f;
            }
        }
        **return map;
    }

    static float Evaluate(float value)
    {
        value *= 24f;
        float c = -1f;
        float y1 = -(value - Mathf.Sin(value)) - 0.2f;
        float y2 = y1 / c + Mathf.Sin(y1 / c);
        float y3 = y2 - Mathf.Sin(y2);
        float y4 = y3 + Mathf.Sin(y2) * 0.25f;
        float y5 = y4 - (Mathf.Sin(y3 / 11.5f * Mathf.PI * 2f));
        float y6 = y5 - Mathf.Sin(y4 * 1.2f) / 1.4f;

        return y6 / 40f;
    }
}
```

![Screenshot 2023-03-21 165106.png](Screenshot_2023-03-21_165106.png)

[](https://www.notion.so)

[](https://www.notion.so)