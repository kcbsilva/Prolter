'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Wifi, Shield, Copy, RefreshCw, Check, Zap, Eye, EyeOff } from 'lucide-react';

interface ConfigSectionProps {
  title: string;
  userTemplate: string;
  passwordTemplate: string;
  userResult: string;
  passwordResult: string;
  onUserChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  isUnique?: boolean;
}

interface ResultDisplayProps {
  result: string;
  field: string;
  type?: 'text' | 'password';
}

interface TagSuggestionsProps {
  onTagClick: (tag: string) => void;
}

export default function AuthWizard() {
  // PPPoE States
  const [pppoeUserTemplate, setPppoeUserTemplate] = useState('{{primeiro-nome-cliente}}{{ultimo-nome-cliente}}');
  const [pppoePasswordTemplate, setPppoePasswordTemplate] = useState('{{rand-numero-5}}');
  const [pppoeUserResult, setPppoeUserResult] = useState('joaotorres');
  const [pppoePassResult, setPppoePassResult] = useState('61407');
  
  // Hotspot States
  const [hotspotUserTemplate, setHotspotUserTemplate] = useState('{{primeiro-nome-cliente}}');
  const [hotspotPasswordTemplate, setHotspotPasswordTemplate] = useState('{{rand-alfa-10}}');
  const [hotspotUserResult, setHotspotUserResult] = useState('joao');
  const [hotspotPassResult, setHotspotPassResult] = useState('ABCDEFGHJK');

  // UI States
  const [activeTab, setActiveTab] = useState('pppoe');
  const [copiedField, setCopiedField] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Available tags for suggestions
  const commonTags = [
    '{{cod-cliente}}',
    '{{cod-contrato}}',
    '{{primeiro-nome-cliente}}',
    '{{ultimo-nome-cliente}}',
    '{{rand-numero-5}}',
    '{{rand-alfa-10}}',
    '{{rand-alfanum-10}}'
  ];

  // Auto-generate results when templates change
  useEffect(() => {
    const generateResult = (template: string): string => {
      return template
        .replace(/\{\{primeiro-nome-cliente\}\}/g, 'joao')
        .replace(/\{\{ultimo-nome-cliente\}\}/g, 'torres')
        .replace(/\{\{cod-cliente\}\}/g, '12345')
        .replace(/\{\{cod-contrato\}\}/g, '67890')
        .replace(/\{\{rand-numero-5\}\}/g, Math.floor(Math.random() * 100000).toString().padStart(5, '0'))
        .replace(/\{\{rand-alfa-10\}\}/g, Math.random().toString(36).substring(2, 12).toUpperCase())
        .replace(/\{\{rand-alfanum-10\}\}/g, Math.random().toString(36).substring(2, 12));
    };

    setPppoeUserResult(generateResult(pppoeUserTemplate));
    setPppoePassResult(generateResult(pppoePasswordTemplate));
    setHotspotUserResult(generateResult(hotspotUserTemplate));
    setHotspotPassResult(generateResult(hotspotPasswordTemplate));
  }, [pppoeUserTemplate, pppoePasswordTemplate, hotspotUserTemplate, hotspotPasswordTemplate]);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(''), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const regenerateResults = () => {
    setIsGenerating(true);
    setTimeout(() => {
      // Trigger re-generation by updating state
      setPppoeUserTemplate(prev => prev + ' ');
      setPppoeUserTemplate(prev => prev.trim());
      setIsGenerating(false);
    }, 800);
  };

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(''), 2000);
    }, 1000);
  };

  const insertTag = (template: string, setTemplate: (value: string) => void, tag: string) => {
    setTemplate(template + tag);
  };

  const ResultDisplay: React.FC<ResultDisplayProps> = ({ result, field, type = "text" }) => (
    <div className="group relative mt-2 p-4 bg-muted/30 border border-border rounded-lg transition-all duration-300 hover:shadow-md hover:bg-muted/50 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Resultado:</span>
        </div>
        <div className="flex items-center gap-2">
          {type === "password" && (
            <button
              onClick={() => setShowPasswords(!showPasswords)}
              className="p-1 hover:bg-accent/10 rounded transition-colors"
              type="button"
            >
              {showPasswords ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            </button>
          )}
          <button
            onClick={() => copyToClipboard(result, field)}
            className="opacity-0 group-hover:opacity-100 p-1 hover:bg-accent/10 rounded transition-all duration-200"
            type="button"
          >
            {copiedField === field ? (
              <Check className="w-4 h-4 text-accent" />
            ) : (
              <Copy className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>
      <div className="mt-2 font-mono text-lg font-semibold text-foreground">
        {type === "password" && !showPasswords ? "•".repeat(result.length) : result}
      </div>
    </div>
  );

  const TagSuggestions: React.FC<TagSuggestionsProps> = ({ onTagClick }) => (
    <div className="mt-3 space-y-2 animate-fadeIn">
      <div className="text-xs font-medium text-muted-foreground">Sugestões rápidas:</div>
      <div className="flex flex-wrap gap-2">
        {commonTags.map(tag => (
          <Badge
            key={tag}
            variant="outline"
            className="cursor-pointer hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all duration-200 text-xs"
            onClick={() => onTagClick(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );

  const ConfigSection: React.FC<ConfigSectionProps> = ({ 
    userTemplate, 
    passwordTemplate, 
    userResult, 
    passwordResult, 
    onUserChange, 
    onPasswordChange,
    isUnique = true 
  }) => (
    <div className="space-y-6">
      {/* User Configuration */}
      <div className="space-y-3 animate-fadeIn">
        <div className="flex items-center gap-2">
          <label className="block font-medium text-sm text-foreground">Usuário</label>
          {isUnique && (
            <Badge variant="destructive" className="text-xs animate-pulse">
              Único Obrigatório
            </Badge>
          )}
        </div>
        
        <Textarea
          value={userTemplate}
          onChange={(e) => onUserChange(e.target.value)}
          className="h-20 transition-all duration-200 focus:ring-2 focus:ring-accent border-border bg-input text-foreground"
          placeholder="Digite o template do usuário..."
        />
        
        <ResultDisplay result={userResult} field={`${activeTab}-user`} />
        
        <TagSuggestions onTagClick={(tag: string) => insertTag(userTemplate, onUserChange, tag)} />
        
        <div className="text-xs text-muted-foreground space-y-1 p-3 bg-muted/20 rounded border border-border">
          <div><strong className="text-foreground">Caracteres permitidos:</strong> 0-9 a-z A-Z - _ . @ :</div>
        </div>
      </div>

      {/* Password Configuration */}
      <div className="space-y-3 animate-fadeIn">
        <div className="flex items-center gap-2">
          <label className="block font-medium text-sm text-foreground">Senha</label>
          <Badge variant="secondary" className="text-xs">
            Não precisa ser único
          </Badge>
        </div>
        
        <Textarea
          value={passwordTemplate}
          onChange={(e) => onPasswordChange(e.target.value)}
          className="h-20 transition-all duration-200 focus:ring-2 focus:ring-accent border-border bg-input text-foreground"
          placeholder="Digite o template da senha..."
        />
        
        <ResultDisplay result={passwordResult} field={`${activeTab}-pass`} type="password" />
        
        <TagSuggestions onTagClick={(tag: string) => insertTag(passwordTemplate, onPasswordChange, tag)} />
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto bg-grid-pattern min-h-screen">
      {/* Header */}
      <div className="text-center space-y-3 animate-fadeIn">
        <div className="bg-animated-prolter bg-clip-text text-transparent">
          <h1 className="text-4xl font-bold">
            Assistente de Autenticação
          </h1>
        </div>
        <p className="text-muted-foreground text-base">
          Configure templates para geração automática de credenciais
        </p>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4 animate-fadeIn">
        <Button
          onClick={regenerateResults}
          variant="outline"
          className="group transition-all duration-200 hover:scale-105 hover:border-accent hover:text-accent"
          disabled={isGenerating}
          type="button"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isGenerating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} />
          {isGenerating ? 'Gerando...' : 'Regenerar Exemplos'}
        </Button>
        
        <Button
          onClick={handleSave}
          className="group transition-all duration-200 hover:scale-105 bg-accent hover:bg-accent/90 text-accent-foreground"
          disabled={saveStatus === 'saving'}
          type="button"
        >
          {saveStatus === 'saving' && <RefreshCw className="w-4 h-4 mr-2 animate-spin" />}
          {saveStatus === 'saved' && <Check className="w-4 h-4 mr-2" />}
          {saveStatus === '' && <span className="mr-2">💾</span>}
          {saveStatus === 'saving' ? 'Salvando...' : saveStatus === 'saved' ? 'Salvo!' : 'Salvar'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="animate-fadeIn">
        <TabsList className="grid w-full grid-cols-2 mb-6 bg-muted border border-border">
          <TabsTrigger 
            value="pppoe" 
            className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200"
          >
            <Wifi className="w-4 h-4" />
            PPPoE
          </TabsTrigger>
          <TabsTrigger 
            value="hotspot" 
            className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
            Hotspot
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pppoe" className="mt-0 animate-fadeIn">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border bg-card">
            <CardHeader className="bg-primary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Wifi className="w-5 h-5 text-primary" />
                Configuração PPPoE
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ConfigSection
                title="PPPoE"
                userTemplate={pppoeUserTemplate}
                passwordTemplate={pppoePasswordTemplate}
                userResult={pppoeUserResult}
                passwordResult={pppoePassResult}
                onUserChange={setPppoeUserTemplate}
                onPasswordChange={setPppoePasswordTemplate}
                isUnique={true}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hotspot" className="mt-0 animate-fadeIn">
          <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-border bg-card">
            <CardHeader className="bg-secondary/5 border-b border-border">
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Shield className="w-5 h-5 text-secondary" />
                Configuração Hotspot
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <ConfigSection
                title="Hotspot"
                userTemplate={hotspotUserTemplate}
                passwordTemplate={hotspotPasswordTemplate}
                userResult={hotspotUserResult}
                passwordResult={hotspotPassResult}
                onUserChange={setHotspotUserTemplate}
                onPasswordChange={setHotspotPasswordTemplate}
                isUnique={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}