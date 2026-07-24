export function formatarData(
    data: Date
  ): string {
  
  
    return data.toLocaleDateString(
      "pt-BR"
    );
  
  
  }
  
  
  export function formatarDataHora(
    data: Date
  ): string {
  
  
    return data.toLocaleString(
      "pt-BR"
    );
  
  
  }