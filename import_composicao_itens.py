
import pandas as pd
import os
import glob

# --- Configuração ---
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_dir = os.path.join(script_dir, 'CSV')
output_csv_path = os.path.join(script_dir, 'composicao_itens_temp.csv')
composicoes_csv_path = os.path.join(script_dir, 'composicoes_para_importar.csv')

def processar_composicao_itens():
    """
    Processa os itens de composição dos arquivos CSV e gera um arquivo temporário.
    """
    try:
        df_composicoes_importadas = pd.read_csv(composicoes_csv_path, dtype={'codigo': str})
        codigos_composicoes_a_manter = df_composicoes_importadas['codigo'].unique()
    except FileNotFoundError:
        print(f"Arquivo 'composicoes_para_importar.csv' não encontrado. Execute o script de importação de composições primeiro.")
        return

    composicao_files = glob.glob(os.path.join(csv_dir, 'SINAPI_Custo_Ref_Composicoes_Analitico_*.csv'))
    
    if not composicao_files:
        print("Nenhum arquivo de composição encontrado na pasta CSV.")
        return

    all_itens_dfs = []
    print(f"Encontrados {len(composicao_files)} arquivos de composições para processar...")

    for filepath in composicao_files:
        filename = os.path.basename(filepath)
        print(f"Processando: {filename}")
        
        try:
            df = pd.read_csv(filepath, skiprows=5, sep=',', encoding='latin1', dtype=str)
            df.columns = df.columns.str.strip()

            # Filtrar apenas as linhas de itens
            df_itens = df[df['TIPO ITEM'].notna()].copy()

            # Filtrar para manter apenas os itens das composições que já foram importadas
            df_itens = df_itens[df_itens['CODIGO DA COMPOSICAO'].isin(codigos_composicoes_a_manter)]

            if df_itens.empty:
                continue

            # --- Processamento das colunas de custo ---
            for col in ['COEFICIENTE', 'PRECO UNITARIO', 'CUSTO TOTAL.1']:
                df_itens[col] = df_itens[col].str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
                df_itens[col] = pd.to_numeric(df_itens[col], errors='coerce').fillna(0.0)

            # --- Renomear e selecionar colunas ---
            df_itens.rename(columns={
                'CODIGO DA COMPOSICAO': 'codigo_composicao',
                'CODIGO ITEM': 'codigo_insumo',
                'TIPO ITEM': 'tipo_item',
                'COEFICIENTE': 'coeficiente',
                'PRECO UNITARIO': 'preco_unitario',
                'CUSTO TOTAL.1': 'custo_total'
            }, inplace=True)
            
            final_columns = [
                'codigo_composicao', 'codigo_insumo', 'tipo_item', 'coeficiente',
                'preco_unitario', 'custo_total'
            ]
            all_itens_dfs.append(df_itens[final_columns])

        except Exception as e:
            print(f"  Erro ao processar o arquivo {filename}: {e}")

    if not all_itens_dfs:
        print("Nenhum item de composição pôde ser processado.")
        return

    print("\nConsolidando todos os dados...")
    final_df = pd.concat(all_itens_dfs, ignore_index=True)

    final_df.to_csv(output_csv_path, index=False, encoding='utf-8', sep=',')
    print(f"\nScript concluído! {len(final_df)} itens de composição processados.")
    print(f"Arquivo final salvo em: '{output_csv_path}'")

if __name__ == '__main__':
    processar_composicao_itens()
