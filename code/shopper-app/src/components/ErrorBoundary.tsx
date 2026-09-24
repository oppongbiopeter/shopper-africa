import React, { Component, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { logError } from '../services/errors';

type Props = { children: ReactNode; fallbackTitle?: string };
type State = { hasError: boolean; message: string };

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, message: '' };
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error?.message || 'Unexpected UI error' };
  }
  componentDidCatch(error: Error, info: { componentStack?: string }) {
    logError('ErrorBoundary', error, { stack: info?.componentStack });
  }
  reset = () => this.setState({ hasError: false, message: '' });
  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.box}>
          <Text style={styles.title}>{this.props.fallbackTitle || 'Something went wrong'}</Text>
          <Text style={styles.msg}>The screen hit an error. You can try again without restarting the app.</Text>
          <TouchableOpacity style={styles.btn} onPress={this.reset}>
            <Text style={styles.btnText}>Try again</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}
const styles = StyleSheet.create({
  box: { flex: 1, justifyContent: 'center', padding: 24, backgroundColor: '#fff' },
  title: { fontSize: 20, fontWeight: '900', marginBottom: 8 },
  msg: { color: '#666', lineHeight: 20, marginBottom: 16 },
  btn: { backgroundColor: '#FFCC00', padding: 14, borderRadius: 12, alignItems: 'center' },
  btnText: { fontWeight: '800' },
});
