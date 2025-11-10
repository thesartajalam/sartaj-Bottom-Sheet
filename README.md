# sartaj-Bottom-Sheet
A flexible, animated, and fully customizable bottom sheet component for React Native, built using the Animated API and PanResponder — no external dependencies required.


# 🧩 React Native Custom Bottom Sheet

A flexible, animated, and fully customizable **Bottom Sheet** component for React Native — built using only the **Animated API** and **PanResponder**.  
No external dependencies required.  

Supports multiple snap points, keyboard awareness, gesture-based dragging, and platform-specific back handling (Android hardware back and iOS navigation gestures).  
Perfect for modals, forms, menus, or action sheets.

---

## ⚡ Features

- 🎯 Multiple **snap points** with smooth spring animations  
- 📱 **Keyboard-aware footer** that adjusts position dynamically  
- 🧭 Handles **Android back button** and **iOS navigation gestures** gracefully  
- 👆 **Drag to close** with realistic spring motion  
- 🧩 Works with both **functional** and **imperative** approaches (`ref.snapTo`, `ref.close`)  
- 🌈 Customizable styles, indicator visibility, and footer height  
- 💡 Built entirely with **React Native Animated API** — no Reanimated or Gesture Handler required  

---

## 🛠️ Installation

Just copy the `BottomSheet.js` file into your project and import it where needed.  
No extra libraries needed.


# Clone repo (optional)
git clone https://github.com/your-username/react-native-custom-bottomsheet.git


---

## 📖 Props

| Prop                    | Type        | Default | Description                                         |
| ----------------------- | ----------- | ------- | --------------------------------------------------- |
| `visible`               | `boolean`   | `false` | Controls visibility of the bottom sheet             |
| `onClose`               | `function`  | —       | Callback when the sheet is closed                   |
| `snapPoints`            | `array`     | —       | Array of snap heights (e.g., `[200, '50%', '80%']`) |
| `initialSnap`           | `number`    | `0`     | Index of initial snap point                         |
| `footer`                | `ReactNode` | —       | Optional footer view (e.g., buttons, inputs)        |
| `footerHeightDecreaser` | `number`    | `0`     | Adjusts footer height when keyboard appears         |
| `showIndicator`         | `boolean`   | `true`  | Shows draggable indicator on top                    |
| `style`                 | `ViewStyle` | —       | Custom style for the sheet container                |

---

## 🔧 Imperative Methods (via ref)

| Method          | Description                                      |
| --------------- | ------------------------------------------------ |
| `snapTo(index)` | Animate the sheet to a specific snap point index |
| `close()`       | Close the sheet with animation                   |

---

## 🧠 Usage Example

```jsx
import React, { useRef, useState } from 'react';
import { View, Button, Text } from 'react-native';
import BottomSheet from './BottomSheet'; // path to your file

export default function App() {
  const [sheetVisible, setSheetVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  const [sheetVisible, setSheetVisible] = useState(false);
  const snapPoints = useMemo(() => ['80%'], []);

  const openSheet = () => setSheetVisible(true);
  const closeSheet = () => bottomSheetRef.current?.close();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Open Bottom Sheet" onPress={() => setVisible(true)} />

      <BottomSheet
        ref={bottomSheetRef}
        visible={sheetVisible}
        onClose={() => setSheetVisible(false)}
        snapPoints={[200, '50%', '80%']}
        initialSnap={1}
        showIndicator
        footer
        footerHeightDecreaser
      >
        <Text style={{ color: '#fff' }}>Your content here</Text>
      </BottomSheet>
    </View>
  );
}
```

---

## 🧭 Platform Support

✅ Android
✅ iOS

Handles:

* **Android hardware back press**
* **iOS navigation back gesture**

---

## 🎨 Customization

You can easily modify:

* `backgroundColor` in the stylesheet for dark/light themes
* `borderTopLeftRadius` and `borderTopRightRadius` for rounded corners
* `padding` and `footerHeightDecreaser` for layout adjustments
* `showIndicator` to toggle the top drag handle

---


## 💬 Keywords

`react-native`, `bottom-sheet`, `custom-bottomsheet`, `animated-bottomsheet`, `react-native-ui`, `gesture-bottom-sheet`

---

## 📄 License

**Copyright © 2025 Sartaj Alam — All Rights Reserved.**

This software and its source code are the property of **Sartaj Alam**.
Unauthorized copying, modification, distribution, or use of this software,
via any medium, is strictly prohibited without the express written permission
of the author.

For permission or inquiries, please contact:
📧 [[your-email@example.com](sartajalam565@gmail.com)]
🔗 [[https://github.com/your-github-username](https://github.com/thesartajalam)]

---

### 👨‍💻 Author

**Sartaj Alam**
Built with ❤️ using React Native Animated API.

