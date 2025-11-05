
import pandas as pd
import os
import glob

# --- Configuração ---
script_dir = os.path.dirname(os.path.abspath(__file__))
csv_dir = os.path.join(script_dir, 'CSV')
output_csv_path = os.path.join(script_dir, 'insumos_para_importar.csv')

# Palavras-chave para identificar insumos de mão de obra
# Esta lista pode ser refinada para maior precisão
mao_de_obra_keywords = [
    'PEDREIRO', 'SERVENTE', 'CARPINTEIRO', 'ARMADOR', 'ELETRICISTA', 'ENCANADOR',
    'PINTOR', 'OPERADOR', 'MOTORISTA', 'ENCARREGADO', 'MESTRE', 'TECNICO', 'ENGENHEIRO',
    'TOPOGRAFO', 'APONTADOR', 'AUXILIAR', 'MONTADOR', 'SOLDADOR', 'MARTELETEIRO'
]

def processar_insumos():
    """
    Processa todos os arquivos de insumos da pasta CSV, unifica e formata os dados.
    """
    # Encontra todos os arquivos de insumos na pasta CSV
    insumo_files = glob.glob(os.path.join(csv_dir, 'SINAPI_Preco_Ref_Insumos_*.csv'))
    
    if not insumo_files:
        print("Nenhum arquivo de insumos encontrado na pasta CSV.")
        return

    all_insumos_dfs = []
    print(f"Encontrados {len(insumo_files)} arquivos de insumos para processar...")

    for filepath in insumo_files:
        filename = os.path.basename(filepath)
        print(f"Processando: {filename}")
        
        # Extrai estado e desoneração do nome do arquivo
        parts = filename.split('_')
        estado = parts[4]
        desonerado = 'Desonerado' in parts[6]

        try:
            df = pd.read_csv(filepath, skiprows=6, sep=',', encoding='latin1', dtype=str)
            df.columns = df.columns.str.strip()

            # --- Processamento das colunas ---
            df['base_id'] = 1
            df['estado'] = estado
            df['desonerado'] = desonerado

            price_col = 'PRECO MEDIANO R$'
            df['preco_unitario'] = df[price_col].str.replace('.', '', regex=False).str.replace(',', '.', regex=False)
            df['preco_unitario'] = pd.to_numeric(df['preco_unitario'], errors='coerce').fillna(0.0)

            # --- Classificação do tipo de insumo ---
            desc_col = 'DESCRICAO DO INSUMO'
            # Cria uma expressão regex com as palavras-chave (insensível a maiúsculas/minúsculas)
            keyword_regex = '|'.join(mao_de_obra_keywords)
            is_mao_de_obra = df[desc_col].str.contains(keyword_regex, case=False, na=False)
            
            df['tipo_insumo'] = 'material' # Padrão
            df.loc[is_mao_de_obra, 'tipo_insumo'] = 'mao_de_obra'

            df['preco_material'] = 0.0
            df['preco_mao_obra'] = 0.0
            df.loc[df['tipo_insumo'] == 'material', 'preco_material'] = df['preco_unitario']
            df.loc[df['tipo_insumo'] == 'mao_de_obra', 'preco_mao_obra'] = df['preco_unitario']

            # --- Renomear e selecionar colunas ---
            df.rename(columns={
                'CODIGO': 'codigo_item',
                'DESCRICAO DO INSUMO': 'descricao',
                'UNIDADE DE MEDIDA': 'unidade'
            }, inplace=True)
            
            final_columns = [
                'base_id', 'codigo_item', 'descricao', 'unidade', 'preco_material',
                'preco_mao_obra', 'tipo_insumo', 'estado', 'desonerado'
            ]
            all_insumos_dfs.append(df[final_columns])

        except Exception as e:
            print(f"  Erro ao processar o arquivo {filename}: {e}")

    # --- Consolidação e Salvamento ---
    if not all_insumos_dfs:
        print("Nenhum arquivo de insumo pôde ser processado.")
        return

    print("\nConsolidando todos os dados...")
    final_df = pd.concat(all_insumos_dfs, ignore_index=True)

    # --- Filtrar por estados ---
    estados_para_manter = ['SC', 'SP', 'RS', 'RJ', 'PR']
    final_df = final_df[final_df['estado'].isin(estados_para_manter)]

    final_df.to_csv(output_csv_path, index=False, encoding='utf-8', sep=',')
    print(f"\nScript concluído! {len(final_df)} insumos processados.")
    print(f"Arquivo final salvo em: '{output_csv_path}'")

if __name__ == '__main__':
    processar_insumos()
