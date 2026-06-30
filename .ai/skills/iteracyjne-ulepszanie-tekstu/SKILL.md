---
name: iteracyjne-ulepszanie-tekstu
description: Use when you generate text and want it to be as good as possible before handing it over - run a generate-score-improve loop instead of shipping the first draft. Triggers - "napisz i dopracuj", "wygeneruj najlepszą wersję", "popraw to iteracyjnie", "self-improve the draft", drafting marketing/brand copy that must hit a quality bar.
---

# Iteracyjne ulepszanie własnego tekstu

## Po co to jest

Pierwszy draft modelu prawie nigdy nie jest najlepszy, na jaki go stać. Ten skill wymusza pętlę **wygeneruj → oceń → popraw**, powtarzaną dokładnie 3 razy (domyślnie), tak by oddać najlepszą zważoną wersję — a nie pierwszą lepszą.

**Zasada główna:** oceniasz własny tekst tak samo bezlitośnie jak cudzy. Samozadowolenie zawyża wynik i zatrzymuje ulepszanie za wcześnie.

**REQUIRED SUB-SKILL:** ocenianie w każdej iteracji wykonuj skillem `ocena-tekstu-0-100` (kryteria, pasma, wymóg cytatu). Nie wymyślaj własnej skali.

## Kiedy używać

- Generujesz copy/treść, która ma trafić do użytkownika i musi być dopracowana.
- Jest jakiś próg jakości albo po prostu „ma być jak najlepiej".
- Masz kryteria/wytyczne, względem których da się mierzyć postęp.

Nie używaj do szybkich, jednorazowych odpowiedzi, gdzie jakość nie ma znaczenia.

## Pętla (3 iteracje)

```
draft_0 = wygeneruj pierwszą wersję względem celu + kryteriów
best = draft_0;  best_wynik = ocena(draft_0)

dla i = 1..3:
    wynik_i, problemy_i = ocena(draft_{i-1})        # skill ocena-tekstu-0-100
    jeśli wynik_i >= próg (domyślnie 90): przerwij    # już wzorcowe
    draft_i = przepisz draft_{i-1}, naprawiając
              NAJCIĘŻSZE problemy_i jako pierwsze
    wynik_draft_i = ocena(draft_i)
    jeśli wynik_draft_i > best_wynik:                # chroń przed regresją
        best = draft_i;  best_wynik = wynik_draft_i
zwróć best  (NIE ostatni — najlepiej oceniony)
```

Kluczowe reguły pętli:
1. **Każda iteracja to realna ocena**, nie „chyba lepsze". Użyj `ocena-tekstu-0-100` i wypisz liczbę.
2. **Naprawiaj od najcięższego.** Bierz problemy posortowane wg wagi/severity, nie kosmetykę.
3. **Trzymaj najlepszy wynik, nie ostatni.** Jeśli iteracja pogorszyła wynik — wróć do poprzedniej wersji.
4. **Nie zatrzymuj się przed 3 iteracjami** tylko dlatego, że „jest okej" — chyba że wynik osiągnął próg wzorcowy (90+).

## Co oddać użytkownikowi

```
Najlepsza wersja (wynik 88/100):
<finalny tekst>

Postęp: 54 → 71 → 88 (iteracja 3 wybrana jako najlepsza)
Co zmieniło się między wersjami:
- it.1→2: usunięto słowa-hype i nadmiar wykrzykników
- it.2→3: dodano korzyść klienta w pierwszym zdaniu, brytyjska pisownia
```

Pokazuj progresję wyników — to dowód, że pętla naprawdę działała, a nie pozorowała.

## Czerwone flagi — STOP, robisz to źle

- „Pierwszy draft jest dobry, pominę iteracje" → wykonaj wszystkie 3, chyba że 90+.
- „Poprawiłem, na pewno jest lepiej" bez ponownej oceny → policz wynik, zanim uznasz poprawę.
- Wynik rośnie magicznie 60→95 w jednym kroku bez konkretnych zmian → oceniasz po swojemu, zawyżasz. Oceniaj jak cudzy tekst.
- Oddajesz ostatnią wersję, choć była gorsza od wcześniejszej → oddaj najlepiej ocenioną.
- Same liczby bez listy zmian → pokaż, co konkretnie naprawiłeś między wersjami.

## Częste błędy

| Błąd | Naprawa |
|------|---------|
| Generuj raz, koniec | Pętla MUSI wykonać 3 iteracje (lub stop na 90+). |
| Kosmetyczne zmiany | Naprawiaj najcięższe problemy z oceny, nie literówki. |
| Zawyżanie samooceny | Stosuj `ocena-tekstu-0-100` dosłownie, z cytatami i pasmami. |
| Oddanie ostatniej wersji | Zwróć wersję o najwyższym wyniku. |
| Brak dowodu postępu | Pokaż ścieżkę wyników i diff zmian. |

## Powiązane

Sędzią w każdej iteracji jest `ocena-tekstu-0-100`. W tym repo (BrandLint) jako kryteria użyj wytycznych marki podanych przez użytkownika.
