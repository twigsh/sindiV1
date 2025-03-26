
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [amount, setAmount] = useState(1000);
  const [rateData, setRateData] = useState(null);
  const [converted, setConverted] = useState(0);

  const pairs = [
    { from: "RUB", to: "CNY" },
    { from: "RUB", to: "THB" },
    { from: "RUB", to: "TRY" },
    { from: "RUB", to: "AED" },
    { from: "RUB", to: "USDT" },
  ];

  useEffect(() => {
    const fetchRates = async () => {
      const fiat = await fetch("https://api.exchangerate.host/latest?base=RUB&symbols=CNY,THB,TRY,AED").then(res => res.json());
      const crypto = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=rub").then(res => res.json());

      const usdtRate = 1 / crypto.tether.rub;

      setRateData({
        ...fiat.rates,
        USDT: usdtRate
      });
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (rateData) {
      const rate = rateData["CNY"];
      setConverted((amount * rate * 0.99).toFixed(2));
    }
  }, [amount, rateData]);

  return (
    <main className="p-4 max-w-3xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Сервис обмена валют и криптовалют</h1>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Онлайн-конвертер</h2>
        <div className="flex gap-4 items-end">
          <div>
            <label className="text-sm">Сумма в рублях</label>
            <Input type="number" value={amount} onChange={e => setAmount(+e.target.value)} />
          </div>
          <div>
            <label className="text-sm">Получите (юани)</label>
            <Input type="text" value={converted} readOnly />
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Курсы валют (с накруткой 1%)</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {pairs.map(({ from, to }) => {
            const rate = rateData?.[to];
            const adjusted = rate ? (rate * 0.99).toFixed(4) : "...";
            return (
              <Card key={`${from}-${to}`}>
                <CardContent className="p-4">
                  <div className="font-medium">{from} → {to}</div>
                  <div className="text-lg">{adjusted}</div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Оставить заявку</h2>
        <div className="space-y-2">
          <p>Вы можете оставить заявку через сайт или написать напрямую в Telegram.</p>
          <Button variant="outline" onClick={() => window.open("https://t.me/yourmanager", "_blank")}>Написать в Telegram</Button>
        </div>
      </section>
    </main>
  );
}
