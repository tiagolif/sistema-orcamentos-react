
import pandas as pd
import os
import glob

# --- Configuração ---
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_dir = os.path.join(script_dir, 'CSV')
output_csv_path = os.path.join(script_dir, 'composicoes_para_importar.csv')

def processar_composicoes():
    """
    Processa todos os arquivos de composições da pasta CSV, unifica e formata os dados.
    """
    composicao_files = glob.glob(os.path.join(csv_dir, 'SINAPI_Custo_Ref_Composicoes_Analitico_*.csv'))
    
    if not composicao_files:
        print("Nenhum arquivo de composição encontrado na pasta CSV.")
        return

    all_composicoes_dfs = []
    print(f"Encontrados {len(composicao_files)} arquivos de composições para processar...")

    for filepath in composicao_files:
        filename = os.path.basename(filepath)
        print(f"Processando: {filename}")
        
        parts = filename.split('_')
        estado = parts[5]
        desonerado = 'Desonerado' in parts[7]

        try:
            df = pd.read_csv(filepath, skiprows=5, sep=',', encoding='latin1', dtype=str)
            df.columns = df.columns.str.strip()

            # Filtrar apenas as linhas de composição principal
            df_composicao = df[df['TIPO ITEM'].isnull()].copy()

            df_composicao['base_id'] = 1
            df_composicao['estado'] = estado
            df_composicao['desonerado'] = desonerado

            # --- Processamento das colunas de custo ---
            for col in ['CUSTO TOTAL', 'CUSTO MATERIAL', 'CUSTO MAO DE OBRA']:
                df_composicao[col] = df_composicao[col].str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
                df_composicao[col] = pd.to_numeric(df_composicao[col], errors='coerce').fillna(0.0)

            # --- Renomear e selecionar colunas ---
            df_composicao.rename(columns={
                'CODIGO DA COMPOSICAO': 'codigo',
                'DESCRICAO DA COMPOSICAO': 'descricao',
                'UNIDADE': 'unidade',
                'CUSTO TOTAL': 'custo_total',
                'CUSTO MATERIAL': 'custo_total_material',
                'CUSTO MAO DE OBRA': 'custo_total_mao_obra'
            }, inplace=True)
            
            # Renomear para corresponder à estrutura do banco
            df_composicao.rename(columns={
                'custo_total_mao_obra': 'valor_mao_de_obra'  # Novo nome do campo
            }, inplace=True)
            
            final_columns = [
                'base_id', 'codigo', 'descricao', 'unidade', 'custo_total_material',
                'valor_mao_de_obra', 'custo_total', 'estado', 'desonerado'
            ]
            all_composicoes_dfs.append(df_composicao[final_columns])

        except Exception as e:
            print(f"  Erro ao processar o arquivo {filename}: {e}")

    if not all_composicoes_dfs:
        print("Nenhum arquivo de composição pôde ser processado.")
        return

    print("\nConsolidando todos os dados...")
    final_df = pd.concat(all_composicoes_dfs, ignore_index=True)

    # --- Filtrar por estados ---
    estados_para_manter = ['SC', 'SP', 'RS', 'RJ', 'PR']
    final_df = final_df[final_df['estado'].isin(estados_para_manter)]

    final_df.to_csv(output_csv_path, index=False, encoding='utf-8', sep=',')
    print(f"\nScript concluído! {len(final_df)} composições processadas.")
    print(f"Arquivo final salvo em: '{output_csv_path}'")

if __name__ == '__main__':
    processar_composicoes()
