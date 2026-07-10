import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';

export const C = {
  navy: '#0B1426',
  navyCard: '#1A2B4A',
  white: '#FFFFFF',
  whiteDim: 'rgba(255,255,255,0.50)',
  whiteMid: 'rgba(255,255,255,0.70)',
  border: 'rgba(255,255,255,0.09)',
  borderFocus: 'rgba(255,255,255,0.28)',
};

type AuthFieldProps = TextInputProps & {
  label: string;
  focusKey: string;
  activeFocus: string | null;
  onFocusChange: (key: string | null) => void;
};

export function AuthField({ label, focusKey, activeFocus, onFocusChange, ...rest }: AuthFieldProps) {
  return (
    <View style={field.wrapper}>
      <Text style={field.label}>{label}</Text>
      <TextInput
        style={[field.input, activeFocus === focusKey && field.inputFocused]}
        placeholderTextColor={C.whiteDim}
        onFocus={() => onFocusChange(focusKey)}
        onBlur={() => onFocusChange(null)}
        {...rest}
      />
    </View>
  );
}

export function AuthButton({ title, onPress }: { title: string; onPress: () => void }) {
  return (
    <TouchableOpacity style={btn.root} activeOpacity={0.85} onPress={onPress}>
      <Text style={btn.text}>{title}</Text>
    </TouchableOpacity>
  );
}

export function AuthFooter({
  message,
  linkText,
  onPress,
}: {
  message: string;
  linkText: string;
  onPress: () => void;
}) {
  return (
    <View style={footer.row}>
      <Text style={footer.text}>{message}</Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={footer.link}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
}

export function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <TouchableOpacity style={back.btn} onPress={onPress}>
      <Text style={back.text}>← Back</Text>
    </TouchableOpacity>
  );
}

export function useFormFocus() {
  const [focused, setFocused] = useState<string | null>(null);
  return { focused, setFocused };
}

const field = StyleSheet.create({
  wrapper: { gap: 8 },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: C.whiteMid,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  input: {
    backgroundColor: C.navyCard,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: C.white,
    borderWidth: 1.5,
    borderColor: C.border,
  },
  inputFocused: {
    borderColor: C.borderFocus,
  },
});

const btn = StyleSheet.create({
  root: {
    backgroundColor: C.white,
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  text: {
    color: C.navy,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
});

const footer = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: C.whiteDim,
    fontSize: 14,
  },
  link: {
    color: C.white,
    fontSize: 14,
    fontWeight: '600',
  },
});

const back = StyleSheet.create({
  btn: {
    paddingTop: 8,
    paddingBottom: 24,
    alignSelf: 'flex-start',
  },
  text: {
    color: C.whiteDim,
    fontSize: 15,
    fontWeight: '500',
  },
});
