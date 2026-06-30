---
name: ocena-tekstu-0-100
description: Use when you need to score a piece of text on a 0-100 scale against criteria or a rubric (brand compliance, quality, tone) and want a consistent, evidence-backed number instead of a vague gut feeling. Triggers - "oceń ten tekst", "score this text", "ile na 100", "jak bardzo on-brand", grading/rating drafts.
---

# Ocena tekstu w skali 0-100

## Po co to jest

Holistyczna ocena „na oko" daje liczby niespójne między uruchomieniami i zwykle stłoczone w okolicy 70-85. Ten skill zamienia ocenę w **powtarzalny rachunek**: rozbij na kryteria → oceń każde z dowodem → policz wynik ważony → zakotwicz w pasmach jakości.

**Zasada główna:** żaden punkt odjęty bez zacytowanego dowodu z tekstu. Liczba bez dowodu jest zmyślona.

## Kiedy używać

- Trzeba ocenić draft (post, e-mail, opis, dokumentację) liczbą 0-100.
- Trzeba porównać wersje tekstu obiektywnie.
- Jest rubryka/wytyczne (np. marki) — albo trzeba ocenić ogólną jakość.

Nie używaj do binarnego „akceptuj/odrzuć" bez potrzeby liczby ani do oceny kodu.

## Procedura (wykonaj po kolei)

1. **Ustal kryteria.** Jeśli użytkownik podał rubrykę/wytyczne — użyj ich jako kryteriów. Jeśli nie — użyj domyślnych pięciu: *zgodność z celem, jasność, zwięzłość, ton/styl, poprawność*. Nadaj każdemu wagę (domyślnie równe, sumują się do 100%).
2. **Oceń każde kryterium 0-100** według pasm poniżej. Dla każdego: 1 zdanie uzasadnienia + **cytat** fragmentu, który podnosi lub obniża ocenę.
3. **Policz wynik ważony** = Σ(ocena_kryterium × waga). Zaokrąglij do liczby całkowitej.
4. **Wypisz konkretne problemy** posortowane od najcięższego: cytat → co jest źle → jak naprawić.
5. **Jedno zdanie werdyktu** + pasmo (patrz niżej).

## Pasma — kotwice przeciw zawyżaniu

Przypisuj wynik do pasma ZANIM podasz dokładną liczbę. To eliminuje stłoczenie wokół 70-85.

| Pasmo | Znaczenie |
|-------|-----------|
| 90-100 | Wzorcowe. Brak istotnych zastrzeżeń, gotowe do publikacji. |
| 75-89 | Dobre. Drobne poprawki, działa bez zmian strukturalnych. |
| 60-74 | Akceptowalne z zastrzeżeniami. Kilka realnych problemów do naprawy. |
| 40-59 | Słabe. Łamie kluczowe kryteria, wymaga przepisania fragmentów. |
| 0-39 | Złe. Mija się z celem lub łamie twarde zasady. |

Jeśli tekst łamie **twardą zasadę** z rubryki (np. „zero ALL CAPS", „brytyjska pisownia") — wynik nie może wejść do pasma 75+, niezależnie od reszty.

**Co wygrywa przy konflikcie wzoru i pasma:** wynik z rachunku Σ(ocena×waga) JEST wynikiem końcowym — z jednym wyjątkiem: pasmo nakłada twardy sufit. Jeśli rachunek daje ≥75, a złamana jest twarda zasada, zejdź do 74 (górna granica „akceptowalne"). Nie obniżaj wyniku poniżej rachunku „na czucie" za nakładające się naruszenia — naruszenia są już ujęte w niskich ocenach per-kryterium. Sufit pasma to jedyna dozwolona korekta liczby.

## Format wyniku

```
Wynik: 63/100 (akceptowalne z zastrzeżeniami)

Kryteria:
- Ton/styl (25%): 45 — "AMAZING ... game-changer!!!" łamie zakaz słów-hype i nadmiar wykrzykników.
- Jasność (25%): 80 — przekaz zrozumiały, ale "SO many features" jest mętne.
- Zgodność z celem (20%): 70 — ...
- Zwięzłość (15%): 75 — ...
- Poprawność (15%): 65 — ...

Problemy (od najcięższego):
1. [cytat] → łamie X → popraw na Y
2. ...

Werdykt: Mocny pomysł, ale ton łamie wytyczne marki — wymaga stonowania przed publikacją.
```

## Częste błędy

| Błąd | Naprawa |
|------|---------|
| Jedna holistyczna liczba bez rozbicia | Zawsze pokaż oceny per-kryterium i policz średnią ważoną. |
| Ocena bez cytatu | Każdy odjęty/dodany punkt musi mieć zakotwiczenie w tekście. |
| Stłoczenie w 70-85 | Najpierw przypisz pasmo, dopiero potem liczbę. |
| Ignorowanie twardych zasad rubryki | Złamana twarda zasada blokuje pasma 75+. |
| Zmienny wynik między uruchomieniami | Te same kryteria + wagi + pasma → ten sam rachunek. |

## Powiązane

Do generowania i samodzielnego doszlifowania tekstu w pętli oceny użyj skilla `iteracyjne-ulepszanie-tekstu`, który wywołuje ten skill jako sędziego.
