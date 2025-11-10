import React, {
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
  useState,
  useMemo,
} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
  Keyboard,
  BackHandler,
  Platform,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const { height } = Dimensions.get('window');

const BottomSheet = forwardRef(
  (
    {
      visible,
      onClose,
      children,
      footer,
      snapPoints,
      initialSnap = 0,
      style,
      showIndicator,
      footerHeightDecreaser,
    },
    ref,
  ) => {
    const navigation = useNavigation?.();

    const processedSnapPoints = useMemo(() => {
      return snapPoints.map(p =>
        typeof p === 'string' && p.trim().endsWith('%')
          ? (parseFloat(p) / 100) * height
          : Number(p),
      );
    }, [snapPoints]);

    const translateY = useRef(new Animated.Value(height)).current;
    const clampIndex = idx =>
      Math.max(0, Math.min(idx, processedSnapPoints.length - 1));
    const lastSnap = useRef(processedSnapPoints[clampIndex(initialSnap)]);

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    // Keyboard listeners
    useEffect(() => {
      const showSub = Keyboard.addListener('keyboardDidShow', e => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener('keyboardDidHide', () => {
        setKeyboardHeight(0);
      });

      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }, []);

    // Expose snapTo and close
    useImperativeHandle(ref, () => ({
      snapTo: index => {
        const i = clampIndex(index);
        lastSnap.current = processedSnapPoints[i];
        Animated.spring(translateY, {
          toValue: height - processedSnapPoints[i],
          useNativeDriver: true,
        }).start();
      },
      close: () => {
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onClose && onClose();
        });
      },
    }));

    // Animate when visible changes
    useEffect(() => {
      if (!processedSnapPoints || processedSnapPoints.length === 0) return;

      if (visible) {
        const i = clampIndex(initialSnap);
        lastSnap.current = processedSnapPoints[i];
        Animated.spring(translateY, {
          toValue: height - lastSnap.current,
          useNativeDriver: true,
        }).start();
      } else {
        Animated.timing(translateY, {
          toValue: height,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }, [visible, processedSnapPoints, initialSnap]);

    useEffect(() => {
      if (!visible) return;

      // Android hardware back button
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          if (visible) {
            onClose && onClose();
            return true; // prevent exit
          }
          return false;
        },
      );

      // iOS navigation back gesture
      let unsubscribe;
      if (navigation && Platform.OS === 'ios') {
        unsubscribe = navigation.addListener('beforeRemove', e => {
          if (visible) {
            e.preventDefault(); // stop navigation
            onClose && onClose();
          }
        });
      }

      return () => {
        backHandler.remove();
        unsubscribe && unsubscribe();
      };
    }, [visible, onClose, navigation]);

    // PanResponder for drag
    const panResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 5,
        onPanResponderMove: (_, g) => {
          const newY = height - lastSnap.current + g.dy;
          if (newY >= 0 && newY <= height) {
            translateY.setValue(newY);
          }
        },
        onPanResponderRelease: (_, g) => {
          const endY = height - lastSnap.current + g.dy;

          // Find closest snap
          let closest = processedSnapPoints[0];
          let minDist = Math.abs(endY - (height - processedSnapPoints[0]));

          processedSnapPoints.forEach(p => {
            const snapY = height - p;
            const dist = Math.abs(endY - snapY);
            if (dist < minDist) {
              closest = p;
              minDist = dist;
            }
          });

          // Close if dragged down
          if (g.dy > 150 && lastSnap.current === processedSnapPoints[0]) {
            onClose && onClose();
            return;
          }

          lastSnap.current = closest;
          Animated.spring(translateY, {
            toValue: height - closest,
            useNativeDriver: true,
          }).start();
        },
      }),
    ).current;

    return (
      <>
        {visible && (
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.backdrop} />
          </TouchableWithoutFeedback>
        )}
        <Animated.View
          style={[styles.sheet, style, { transform: [{ translateY }] }]}
          {...panResponder.panHandlers}
        >
          {showIndicator && <View style={styles.indicator} />}
          <View style={{ flex: 1 }}>{children}</View>

          {/* Footer sticks to bottom and rises with keyboard */}
          {footer && visible && (
            <Animated.View
              style={[
                styles.footer,
                { marginBottom: keyboardHeight - footerHeightDecreaser }, // moves above keyboard
              ]}
            >
              {footer}
            </Animated.View>
          )}
        </Animated.View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: height,
    backgroundColor: '#212121',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    padding: 20,
    justifyContent: 'space-between', // space between content and footer
  },
  indicator: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#ccc',
    alignSelf: 'center',
    marginBottom: 10,
  },
  footer: {
    height: 100,
    backgroundColor: null,
    justifyContent: 'center',
  },
});

export default BottomSheet;
