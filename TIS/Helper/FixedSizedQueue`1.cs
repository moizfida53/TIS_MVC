// Decompiled with JetBrains decompiler
// Type: TIS.Helper.FixedSizedQueue`1
// Assembly: TIS, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
// MVID: 16F81D25-AB23-43AD-92C7-05A00A50CBA5
// Assembly location: F:\ALL PROJECTS\CoffeeShop\TFSProjects\Published\published from client server 27 Jan 2022\TIS_MVC_Published_2022_Jan\TIS_MVC_Published\bin\TIS.dll

using System.Collections.Concurrent;

namespace TIS.Helper
{
  public class FixedSizedQueue<T> : ConcurrentQueue<T>
  {
    public int Size { get; private set; }

    public FixedSizedQueue(int size) => this.Size = size;

    private void _Enqueue(T obj)
    {
      base.Enqueue(obj);
      lock (this)
      {
        while (this.Count > this.Size)
          this.TryDequeue(out T _);
      }
    }

    public new void Enqueue(T obj)
    {
    }
  }
}
